import { DataService } from "./data-service";
import "@babel/polyfill";

export class FormSeating {
    dataServiceInstance = null;
    buildingSelectEl = null;
    buildings = null 
    dictionary = null;
    appWrapper = null;
    fakeRow = null;
    allStudentsTableWidth = null;
    facultyAudiences = [];
    facultyName = null;
    toTheTop = 202;
    tableHeight = null;
    tableY = null;
    tableHeaderHeight = 37;
    profiles = [];

    constructor() {
        this.getSelectElements();
        this.dataServiceInstance = new DataService();
        this.getBuildingsSelectData();
        this.getDictionaryData();
        this.addEventListeners();
    }

    getSelectElements() {
        this.appWrapper = document.querySelector(".app-wrapper");
        this.buildingSelectEl = this.appWrapper.querySelector(".building");
        this.profileSelectEl = this.appWrapper.querySelector(".profile");
        this.audienceSelectEl = this.appWrapper.querySelector(".audience");
    }

    addEventListeners() {
        document.addEventListener("mousedown", this.onMouseDown.bind(this));
        document.addEventListener("mousemove", this.onMouseMove.bind(this));
        document.addEventListener("mouseup", this.onMouseUp.bind(this));
        document.addEventListener("change", this.onBuildingSelected.bind(this));
        document.addEventListener("change", this.onProfileSelected.bind(this));
        document.addEventListener("change", this.onAudienceSelected.bind(this));
    }

    getBuildingsSelectData() {
        this.dataServiceInstance.getBuildings()
            .then(buildingsJson => {
                this.buildings = buildingsJson
                console.info(this.buildings);
                this.renderBuildingsSelect();
            })
            .catch(err => console.error(err));
    }

    renderBuildingsSelect() {
        for(const buildingData of this.buildings) {
            const building = document.createElement("option");

            building.label = buildingData.name;
            building.value = buildingData.alias;
            building.append(buildingData.name);
            this.buildingSelectEl.append(building);
        }
    }

    getDictionaryData() {
        this.dataServiceInstance.getDictionary()
            .then(dictionaryJson => {
                this.dictionary = dictionaryJson
                console.info(this.dictionary);
                
            })
            .catch(err => console.error(err));   
    }

    renderProfilesSelect() {
        for(const faculty of this.buildings) {
            if (faculty.name === this.facultyName) {
                faculty.places.forEach(place => {
                    const profileOption = document.createElement("option");

                    profileOption.label = place.code;
                    profileOption.append(place.code);
                    this.profileSelectEl.append(profileOption);
                });
            }
        }
    }

    renderAudiencesSelect() {
        for (const audience of this.facultyAudiences) {
            const audienceOption = document.createElement("option");

            audienceOption.label = audience.name;
            audienceOption.append(audience.name);
            this.audienceSelectEl.append(audienceOption);
        }
    }

    onBuildingSelected(ev) {
        if (ev.target.className === "building") {
            const value = ev.target.selectedOptions[0].value;
            this.facultyName = ev.target.selectedOptions[0].label;
            this.dataServiceInstance.getStudentsList(value)
                .then(responseJson => {
                    // console.info(responseJson);
                    this.renderAllStudents(responseJson);
                })
                .catch(err => console.error(err));
            
            this.renderSeatedStudents();
            this.tableHeight = document.querySelectorAll(".seated-students table")[0].clientHeight - this.tableHeaderHeight;;
            this.amountOfRows = this.facultyAudiences.length;
            this.rowHeight = this.tableHeight / this.amountOfRows;
            this.tableY = this.tableHeight + this.toTheTop;
            this.renderProfilesSelect();
            this.renderAudiencesSelect();
        }
    }

    onProfileSelected(ev) {
        if (ev.target.className === "profile") {
            console.log(ev);
        }
    }

    onAudienceSelected(ev) {
        if (ev.target.className === "audience") {
            console.log(ev);
        }
    }

    renderAllStudents(allStudents) {
        if (allStudents) {
            this.allStudents = allStudents;
        }
        
        const tBodyEl = this.appWrapper.querySelector(".all-students tbody");
        const allStudentsFragment = new DocumentFragment();

        this.clearTableBody(tBodyEl);

        for (const student of this.allStudents) {
            const tr = document.createElement("tr");
            const tdNumber = document.createElement("td");
            const tdName = document.createElement("td");
            const tdRoom = document.createElement("td");
            const tdType = document.createElement("td");
            const tdNeedBel = document.createElement("td");

            tdNumber.append(this.allStudents.indexOf(student) + 1);
            tdName.append(student.firstName, ` ${student.lastName}`, ` ${student.parentName}`);
            tdRoom.append(this.dictionary.audiences[student.audience]);
            tdType.append(this.dictionary.profiles[student.profile]);

            if (student.needBel) {
                const div = document.createElement("div");
                div.classList.add("flag");
                tdNeedBel.append(div);
            }
            
            tr.id = "student";
            tr.classList.add("row-hower");
            tr.classList.add("all-students");
            tr.append(tdNumber, tdName, tdRoom, tdType, tdNeedBel);
            allStudentsFragment.append(tr);
        }

        tBodyEl.append(allStudentsFragment);
    }

    renderSeatedStudents() {
        const tBodyEl = this.appWrapper.querySelector(".seated-students tbody");
        const seatedStudentsFragment = new DocumentFragment();

        this.clearTableBody(tBodyEl);

        for(const faculty of this.buildings) {
            if (faculty.name === this.facultyName) {
                faculty.places.forEach(place => this.facultyAudiences.push(...place.audience));
            }
        }

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

    onMouseDown(ev) {
        if(ev.target.parentNode.id === "student") {
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
            const isFlag = ev.target.parentNode.lastChild.children[0];

            if (isFlag) {
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
            const allDraggedRows = document.getElementsByClassName("draggableRow");
            const theLastDraggedRow = allDraggedRows[allDraggedRows.length - 1];
            const mouseX = ev.x;
            const mouseY = ev.y;

            if (mouseY <= this.tableY && mouseY > this.toTheTop && mouseX > this.allStudentsTableWidth) {
                const numberOfDroppedRow = parseInt((mouseY - this.toTheTop) / this.rowHeight) + 1;                
                const targetAudience = this.facultyAudiences[numberOfDroppedRow - 1];
                const previousAllStudentsAudience = this.allStudents[this.numberOfDraggedRow - 1].audience;

                if (this.checkBel(targetAudience, this.allStudents[this.numberOfDraggedRow - 1])) {
                    alert("Попытка посадить белоруса к не белорусам!");

                    this.removeFakeRow(theLastDraggedRow);

                } else if (targetAudience._id !== this.allStudents[this.numberOfDraggedRow - 1].audience) {
                    const previousSeatedStudentsAudience = this.facultyAudiences.filter(el => el._id === previousAllStudentsAudience);

                    previousSeatedStudentsAudience[0].count --;
                    targetAudience.count ++;
                    this.allStudents[this.numberOfDraggedRow - 1].audience = targetAudience._id
                    this.renderSeatedStudents();
                    this.renderAllStudents();
                }

                this.fakeRow = null;
            }

            this.removeFakeRow(theLastDraggedRow);
        }
    }

    checkBel(newAudience, oldAudience) {
        return newAudience.bel !== oldAudience.needBel;
    }

    removeFakeRow(row) {
        row.innerHTML = "";
        row.classList.remove("fake-row");
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
}