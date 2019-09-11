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
                console.log(this.buildings);
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
        console.log(allStudents);
        
        const tBodyEl = this.appWrapper.querySelector(".all-students tbody");
        const allStudentsFragment = new DocumentFragment();

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

            tr.append(tdNumber, tdName, tdRoom, tdType, tdNeedBel);
            allStudentsFragment.append(tr);
        }

        tBodyEl.append(allStudentsFragment);
    }

    onMouseDown(ev) {
        if(ev.target.parentNode.tagName === "TR") {
            // console.log();
            const selectedRow = ev.target.parentNode;
            this.fakeRow = document.createElement("div");
            const fakeRowWrapper = document.createElement("div");
            const fakeSpanNumber = document.createElement("span");
            const fakeSpanName = document.createElement("span");
            const fakeSpanRoom = document.createElement("span");
            const fakeSpanType = document.createElement("span");
            const fakeSpanBel = document.createElement("span");
            // if() {

            // }

            fakeSpanNumber.append(4);
            fakeSpanName.append("Иванов Петр Сергеевич");
            fakeSpanRoom.append(234);
            fakeSpanType.append("математический");
            fakeSpanBel.append("флаг");

            this.fakeRow.append(fakeSpanNumber, fakeSpanName, fakeSpanRoom, fakeSpanType, fakeSpanBel);
            



            // this.fakeRow.style.position = "absolute";
            this.fakeRow.style.position = "background-color: white";
            this.fakeRow.style.position = "border: 1px solid #212529";
            // this.fakeRow.style.position = "display: inline-table";
            
            fakeRowWrapper.append(this.fakeRow);

            this.moveAt(ev);
            document.body.append(fakeRowWrapper);
            fakeRowWrapper.style.zIndex = 1000;


            console.log(fakeRowWrapper);
        }
    }

    onMouseMove(ev) {
        if(this.fakeRow) {
            this.moveAt(ev);
        }
    }

    onMouseUp() {
        if(this.fakeRow) {
            console.log("=========== End ===============");
        }
    }

    moveAt(ev) {
        // console.log(ev);
        this.fakeRow.style.left = ev.pageX - this.fakeRow.offsetWidth / 2 + 'px';
        this.fakeRow.style.top = ev.pageY - this.fakeRow.offsetHeight / 2 + 'px';
    }

    renderSeatedStudents(facultyName) {
        const tBodyEl = this.appWrapper.querySelector(".seated-students tbody");
        const seatedStudentsFragment = new DocumentFragment();
        const facultyAudiences = [];

        for(const faculty of this.buildings) {
            if (faculty.name === facultyName) {
                facultyAudiences.push(...faculty.places[0].audience);
            }
        }

        console.log(facultyAudiences);

        for (const audience of facultyAudiences) {
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

            tr.append(tdNumber, tdAmount, tdMax, tdBel);

            if (audience.count > audience.max) {
                tr.classList.add("table-danger");
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
                console.log(this.dictionary);
            });
    }

    getGeneratedStatus() {
        fetch(process.env.GENERATE_STATUS_URL)
        .then(response => response.json())
        .then(statusJson => console.log(statusJson));
    }

    // getData(url) { 
        
    //     return  fetch(url)
    //         .then(response => response.json())
    //         .then(responseJson => this.data = responseJson);

    //     // what should I return?
    // }
}