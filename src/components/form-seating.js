export class FormSeating {
    buildings = null;
    dictionary = null;
    appWrapper = null;
    data = null;

    constructor() {
        this.appWrapper = document.querySelector(".app-wrapper");
        this.buildingSelectEl = this.appWrapper.querySelector(".building");
        this.getDictionary();
        this.getBuildings();
        this.buildingSelectEl.addEventListener("change", this.onBuildingSelected.bind(this));
        document.addEventListener("mousedown", this.onMouseDown.bind(this));
        document.addEventListener("mousemove", this.onMouseMove.bind(this));
        document.addEventListener("mouseup", this.onMouseUp.bind(this));
    }

    getBuildings() {
        fetch(process.env.BUILDINGS_URL)
            .then(response => response.json())
            .then(buildingsJson => {
                this.buildings = buildingsJson
                console.info(this.buildings);
                this.renderBuildings();
            });
    }

    renderBuildings() {
        for(const buildingData of this.buildings) {
            const building = document.createElement("option");

            building.label = buildingData.name;
            building.value = buildingData.alias;
            building.append(buildingData.name);
            this.buildingSelectEl.append(building);
        }
    }

    onBuildingSelected(ev) {
        const value = ev.target.selectedOptions[0].value;
        const facultyName = ev.target.selectedOptions[0].label;

        this.getStudentsList(value);
        this.renderSeatedStudents(facultyName);
    }

    getStudentsList(value) {
        fetch(`${process.env.STUDENTS_URL + value}`)
            .then(response => response.json())
            .then(responseJson => this.renderAllStudents(responseJson));
    }

    renderAllStudents(allStudents) {
        console.info(allStudents);
        const tBodyEl = this.appWrapper.querySelector(".all-students tbody");
        const allStudentsFragment = new DocumentFragment();

        this.clearTableBody(tBodyEl);

        for(const student of allStudents) {
            const tr = document.createElement("tr");
            const tdNumber = document.createElement("td");
            const tdName = document.createElement("td");
            const tdRoom = document.createElement("td");
            const tdType = document.createElement("td");
            const tdNeedBel = document.createElement("td");

            tdNumber.append(allStudents.indexOf(student) + 1);
            tdName.append(student.firstName, ` ${student.lastName}`, ` ${student.parentName}`);
            tdRoom.append(this.dictionary.audiences[student.audience]);
            tdType.append(this.dictionary.profiles[student.profile]);

            if (student.needBel) {
                const div = document.createElement("div");
                div.classList.add("flag");
                tdNeedBel.append(div);
            }
            tr.classList.add("row-hower");
            tr.classList.add("all-students");
            tr.append(tdNumber, tdName, tdRoom, tdType, tdNeedBel);
            allStudentsFragment.append(tr);
        }

        tBodyEl.append(allStudentsFragment);
    }

    onMouseDown(ev) {
        if(ev.target.parentNode.className === "row-hower all-students") {
            this.allStudentsTableWidth = ev.target.parentNode.clientWidth;
            this.numberOfDraggedRow = parseInt(ev.target.parentNode.children[0].innerHTML);
            this.fakeRow = document.createElement("div");
            this.fakeRow.className = "draggableRow";
            const fakeDivNumber = document.createElement("div");
            const fakeDivName = document.createElement("div");
            const fakeDivRoom = document.createElement("div");
            const fakeDivType = document.createElement("div");
            const fakeDivBel = document.createElement("div");
            const personInfo = ev.target.parentNode.children;

            if(ev.target.parentNode.lastChild.children[0]) {
                const div = document.createElement("div");
                div.classList.add("flag");
                fakeDivBel.append(div);;
            }

            fakeDivNumber.append(personInfo[0].innerText);
            fakeDivName.append(personInfo[1].innerText);
            fakeDivRoom.append(personInfo[2].innerText);
            fakeDivType.append(personInfo[3].innerText);

            this.fakeRow.append(fakeDivNumber, fakeDivName, fakeDivRoom, fakeDivType, fakeDivBel);
            this.fakeRow.classList.add("fake-row");
            Array.from(this.fakeRow.children).forEach(child => child.classList.add("fake-row-item"));
            document.body.append(this.fakeRow);
            this.moveAt(ev);
        }
    }

    onMouseMove(ev) {
        if(this.fakeRow) {
            this.moveAt(ev);
        }
    }

    moveAt(ev) {
        this.fakeRow.style.left = ev.pageX - this.fakeRow.offsetWidth / 2 + 'px';
        this.fakeRow.style.top = ev.pageY - this.fakeRow.offsetHeight / 2 + 'px';
    }

    onMouseUp(ev) {
        if(this.fakeRow) {            
            const draggedRowArr = document.getElementsByClassName("draggableRow");
            const draggedRow = draggedRowArr[draggedRowArr.length - 1];
            const mouseX = ev.x;
            const mouseY = ev.y;
            const toTheTop = 202;
            const tableHeight = document.querySelectorAll(".seated-students table")[0].clientHeight - 37;
            const amountOfRows = this.facultyAudiences.length;
            const rowHeight = tableHeight / amountOfRows;
            const tableY = tableHeight + toTheTop;
            let numberOfTheRow = amountOfRows;

            for (let i = tableY; i >= toTheTop; i -= rowHeight) {
                if (mouseY <= i && mouseY > (i - rowHeight) && mouseY > toTheTop && mouseX > this.allStudentsTableWidth) {
                    const targetAudience = this.facultyAudiences[numberOfTheRow - 1];
                    const newAmountOfStudents = ++ targetAudience.count;
                    const updatedSeatedStudentsRow = document.querySelectorAll(".seated-students tr")[numberOfTheRow];
                    const maxNumberOfStudents = targetAudience.max;
                    const draggedRow = document.querySelectorAll(".all-students tr")[this.numberOfDraggedRow];

                    if (draggedRow.children[2].innerHTML !== targetAudience.name) {
                        updatedSeatedStudentsRow.children[1].innerHTML = newAmountOfStudents;
                        draggedRow.children[2].innerHTML = targetAudience.name;
                    }

                    if (newAmountOfStudents > maxNumberOfStudents) {
                        updatedSeatedStudentsRow.classList.add("table-danger");
                        updatedSeatedStudentsRow.classList.add("row-hower-danger");
                    }
                    

                } else if (numberOfTheRow >= 1 && mouseY > toTheTop) {
                    numberOfTheRow--;
                } else {
                    console.info("outside of the seated students");
                }
            }

            draggedRow.innerHTML = "";
            draggedRow.classList.remove("fake-row");
        }
    }

    renderSeatedStudents(facultyName) {
        const tBodyEl = this.appWrapper.querySelector(".seated-students tbody");
        const seatedStudentsFragment = new DocumentFragment();
        this.facultyAudiences = [];

        this.clearTableBody(tBodyEl);

        for(const faculty of this.buildings) {
            if (faculty.name === facultyName) {
                faculty.places.forEach(place => this.facultyAudiences.push(...place.audience));
            }
        }

        console.info(this.facultyAudiences);

        for (const audience of this.facultyAudiences) {
            const tr = document.createElement("tr");
            const tdNumber = document.createElement("td");
            const tdAmount = document.createElement("td");
            const tdMax = document.createElement("td");
            const tdBel = document.createElement("td");

            tdNumber.append(audience.name);
            tdNumber.classList.add("bold");
            tdAmount.append(audience.count);
            tdMax.append(audience.max);

            if (audience.bel) {
                const div = document.createElement("div");
                div.classList.add("flag");
                tdBel.append(div);
            }

            tr.classList.add("row-hower");
            tr.append(tdNumber, tdAmount, tdMax, tdBel);

            if (audience.count > audience.max) {
                tr.classList.add("table-danger");
                tr.classList.add("row-hower-danger");
            }

            seatedStudentsFragment.append(tr);
        }

        tBodyEl.append(seatedStudentsFragment);
    }

    getDictionary() {
        fetch(process.env.DICTIONARY_URL)
            .then(response => response.json())
            .then(dictionaryJson => {
                this.dictionary = dictionaryJson
                console.info(this.dictionary);
            });
    }

    getGeneratedStatus() {
        fetch(process.env.GENERATE_STATUS_URL)
        .then(response => response.json())
        .then(statusJson => console.info(statusJson));
    }
    
    clearTableBody(body) {
        if (body.children.length) {
            body.innerHTML = "";
        }
    }

    // getData(url) { 
        
    //     return fetch(url)
    //         .then(response => response.json())
    //         .then(responseJson => this.data = responseJson);
    // }
}