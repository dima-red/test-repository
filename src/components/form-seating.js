import { DataService } from "./data-service";
import "@babel/polyfill";

export class FormSeating {
    appWrapper = null;
    buildingSelectEl = null;
    profileSelectEl = null;
    audienceSelectEl = null;
    dataServiceInstance = null;
    buildings = null 
    dictionary = null;
    fakeRow = null;
    allStudentsTableWidth = null;
    facultyAudiences = [];
    currentFaculty = null;
    toTheTop = 202;
    tableHeight = null;
    tableY = null;
    tableHeaderHeight = 37;
    profiles = [];
    allStudents = null;
    filteredStudents = null;
    sortNameTh = null;
    sortAudienceTh = null;
    sortProfileTh = null;
    sortBelTh = null;
    compareResult = 1;
    sortKey = null;
    sortFlag = false;
    inputEl = null;
    allStudentsBody = null;
    allStudentsBodyRow = null;

    constructor() {
        this.getDomElements();
        this.dataServiceInstance = new DataService();
        this.getDictionaryData();
        this.getBuildingsSelectData();
        this.addEventListeners();
    }

    getDomElements() {
        this.appWrapper = document.querySelector(".app-wrapper");
        this.buildingSelectEl = this.appWrapper.querySelector(".building");
        this.profileSelectEl = this.appWrapper.querySelector(".profile");
        this.audienceSelectEl = this.appWrapper.querySelector(".audience");
        this.sortNameTh = this.appWrapper.querySelector(".sort-name");
        this.sortAudienceTh = this.appWrapper.querySelector(".sort-audience");
        this.sortProfileTh = this.appWrapper.querySelector(".sort-profile");
        this.sortBelTh = this.appWrapper.querySelector(".sort-bel");
        this.inputEl = this.appWrapper.querySelector(".search");
        this.allStudentsBody = this.appWrapper.querySelector(".all-students #all-body");
        this.allStudentsBodyRow = this.appWrapper.querySelector(".all-students #student");
        this.allStudentsBodyRow.remove();





        // const e1 = this.allStudentsBodyRow;
        // const e2 = this.allStudentsBodyRow;
        // e2.children[0].innerHTML = "LoooooL";

        // console.log(e1);
        // console.log(e2);
        // console.log(e1 === e2);

        // const e3 = document.createElement("tr");
        // const e4 = document.createElement("tr");
        // console.log(e3 === e4);
    }

    addEventListeners() {
        document.addEventListener("mousedown", this.onMouseDown.bind(this));
        document.addEventListener("mousemove", this.onMouseMove.bind(this));
        document.addEventListener("mouseup", this.onMouseUp.bind(this));
        document.addEventListener("change", this.onBuildingSelected.bind(this));
        document.addEventListener("change", this.onProfileSelected.bind(this));
        document.addEventListener("change", this.onAudienceSelected.bind(this));
        document.addEventListener("click", this.onSortClicked.bind(this));
        document.addEventListener("keyup", this.onInputChanged.bind(this));
    }

    getBuildingsSelectData() {
        this.dataServiceInstance.getBuildings()
            .then(buildingsObj => {
                this.buildings = buildingsObj
                console.info(this.buildings);
                this.renderBuildingsSelect();
            });
    }

    renderBuildingsSelect() {
        for(const buildingData in this.buildings) {
            const building = document.createElement("option");

            building.label = this.buildings[buildingData].name;
            building.value = this.buildings[buildingData].alias;    //TODO: maybe remove?
            building.append(this.buildings[buildingData].name);
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

    renderSelectsHelper(domEl, selectFragment, items, target) {
        for (const item of items) {
            const selectOption = document.createElement("option");

            selectOption.label = item[target];
            selectOption.append(item[target]);
            selectFragment.append(selectOption);
        }

        domEl.append(selectFragment);
    }

    renderSelects(domEl, placeholderTxt, items) {
        this.clearTableBody(domEl);
        const defaultOption = document.createElement("option");
        const selectFragment = new DocumentFragment();

        defaultOption.innerHTML = placeholderTxt;
        selectFragment.append(defaultOption);

        if (Array.isArray(items)) {
            this.renderSelectsHelper(domEl, selectFragment, items, "name");
        } else {
            this.renderSelectsHelper(domEl, selectFragment, items.places, "code");
        }
    }

    renderProfilesSelect() {
        this.renderSelects(this.profileSelectEl, "Выберите профиль", this.currentFaculty);
    }

    renderAudiencesSelect() {
        this.renderSelects(this.audienceSelectEl, "Выберите аудиторию", this.facultyAudiences);
    }

    onBuildingSelected(ev) {
        if (ev.target.className === "building") {
            const value = ev.target.selectedOptions[0].value;
            this.currentFaculty = this.buildings[value];
            this.dataServiceInstance.getStudentsList(value)
                .then(responseJson => {
                    // console.info(responseJson);
                    this.allStudents = responseJson;
                    this.filteredStudents = responseJson;
                    this.renderAllStudents(responseJson);
                })
                .catch(err => console.error(err));
            
            this.renderSeatedStudents();
            this.tableHeight = document.getElementById("seated").clientHeight - this.tableHeaderHeight;
            this.amountOfRows = this.facultyAudiences.length;
            this.rowHeight = this.tableHeight / this.amountOfRows;
            this.tableY = this.tableHeight + this.toTheTop;
            this.renderProfilesSelect();
            this.renderAudiencesSelect();
        }
    }

    onSelectChosen(targetClassName, targetValue) {
        if (targetClassName === "profile") {
            const filteredStudents = this.allStudents.filter(student => this.dictionary.places[student.place].code === targetValue);

            this.renderAllStudents(filteredStudents);

        } else if (targetClassName === "audience") {
            const filteredStudents = this.allStudents.filter(student => this.dictionary.audiences[student.audience] === targetValue);

            this.renderAllStudents(filteredStudents);
        }
    }

    onProfileSelected(ev) {
        if (ev.target.className === "profile") {
            const targetClassName = ev.target.className;
            const targetValue = ev.target.value;

            this.onSelectChosen(targetClassName, targetValue);
        }
        
        // if (ev.target.className === "profile") {
        //     const filteredStudents = this.allStudents.filter(student => this.dictionary.places[student.place].code === ev.target.value);
        //     this.renderAllStudents(filteredStudents);
        // }
    }

    onAudienceSelected(ev) {
        if (ev.target.className === "audience") {
            const targetClassName = ev.target.className;
            const targetValue = ev.target.value;

            this.onSelectChosen(targetClassName, targetValue);
        }

        // if (ev.target.className === "audience") {
        //     const filteredStudents = this.allStudents.filter(student => this.dictionary.audiences[student.audience] === ev.target.value);
        //     this.renderAllStudents(filteredStudents);
        // }
    }

    renderAllStudents(studentsArray) {
        const allStudentsFragment = new DocumentFragment();

        this.clearTableBody(this.allStudentsBody);



        // for (const student of studentsArray) {

        //     const allStudentsRowTemplate = this.allStudentsBodyRow;

        //     allStudentsRowTemplate.innerHTML = studentsArray.indexOf(student) + 1;

        //     // allStudentsRowTemplate.children[0].append(studentsArray.indexOf(student) + 1);
        //     // allStudentsRowTemplate.children[1].append(student.firstName, ` ${student.lastName}`, ` ${student.parentName}`);
        //     // allStudentsRowTemplate.children[2].append(this.dictionary.audiences[student.audience]);
        //     // allStudentsRowTemplate.children[3].append(this.dictionary.profiles[student.profile]);

        //     // if (student.needBel) {
        //     //     const div = document.createElement("div");
        //     //     div.classList.add("flag");
        //     //     allStudentsRowTemplate.children[4].append(div);
        //     // }
            
           
        //     allStudentsFragment.append(allStudentsRowTemplate);

        //     console.log(student);
        //     // console.log(allStudentsRowTemplate);
        // }






        for (const student of studentsArray) { //TODO: empty tr
            const tr = document.createElement("tr");
            const tdNumber = document.createElement("td");
            const tdName = document.createElement("td");
            const tdRoom = document.createElement("td");
            const tdProfile = document.createElement("td");
            const tdNeedBel = document.createElement("td");

            tdNumber.append(studentsArray.indexOf(student) + 1);
            tdName.append(student.firstName, ` ${student.lastName}`, ` ${student.parentName}`);
            tdRoom.append(this.dictionary.audiences[student.audience]);
            tdProfile.append(this.dictionary.profiles[student.profile]);

            if (student.needBel) {
                const div = document.createElement("div");
                div.classList.add("flag");
                tdNeedBel.append(div);
            }
            
            tr.id = "student";
            tr.classList.add("row-hower");
            tr.classList.add("border");
            tr.append(tdNumber, tdName, tdRoom, tdProfile, tdNeedBel);
            allStudentsFragment.append(tr);
        }

        this.allStudentsBody.append(allStudentsFragment);
    }

    renderSeatedStudents() {
        const seatedSudentsTBody = this.appWrapper.querySelector(".seated-students tbody");
        const seatedStudentsFragment = new DocumentFragment();
        
        this.clearTableBody(seatedSudentsTBody);
        this.facultyAudiences = [];

        this.currentFaculty.places.forEach(place => this.facultyAudiences.push(...place.audience));

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

        seatedSudentsTBody.append(seatedStudentsFragment);
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
                const previousAllStudentsAudience = this.filteredStudents[this.numberOfDraggedRow - 1].audience;

                if (this.checkBel(targetAudience, this.filteredStudents[this.numberOfDraggedRow - 1])) {
                    alert("Попытка посадить белоруса к не белорусам!");

                    this.removeFakeRow(theLastDraggedRow);

                } else if (targetAudience._id !== this.filteredStudents[this.numberOfDraggedRow - 1].audience) {
                    const previousSeatedStudentsAudience = this.facultyAudiences.filter(el => el._id === previousAllStudentsAudience);

                    previousSeatedStudentsAudience[0].count --;
                    targetAudience.count ++;
                    this.filteredStudents[this.numberOfDraggedRow - 1].audience = targetAudience._id;
                    const filteredStudents = this.filteredStudents;
                    this.renderSeatedStudents();
                    this.renderAllStudents(filteredStudents);
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
        body.innerHTML = "";
    }

    onSortClicked(ev) {
        if (this.filteredStudents && ev.target.className === "sort-name") {
            this.sortHandler("firstName");

        } else if (this.filteredStudents && ev.target.className === "sort-audience") {
            this.sortHandler("audience");

        } else if (this.filteredStudents && ev.target.className === "sort-profile") {
            this.sortHandler("profile");

        } else if (this.filteredStudents && ev.target.className === "sort-bel") {
            this.sortHandler("needBel");
        }
    }

    sortHandler(sortKey) {
        this.sortFlag = !this.sortFlag;
            this.sortFlag ? this.compareResult = 1 : this.compareResult = -1;
            this.sortKey = sortKey;
            const filteredStudents = this.filteredStudents.sort(this.compareCb);
            this.renderAllStudents(filteredStudents);
    }

    compareCb = (firstEl, secondEl) => {
        if (firstEl[this.sortKey] < secondEl[this.sortKey]) {
            return -1 * this.compareResult;
        } else if(firstEl[this.sortKey] > secondEl[this.sortKey]) {
            return this.compareResult;
        } else {
            return 0;
        }
    }

    onInputChanged(ev) {
        if (this.allStudents && ev.target.className === "search") {
            const inputValue = ev.target.value.toLowerCase();
            console.info(inputValue);
            const detectedStudents = this.allStudents.filter(student => student.firstName.toLowerCase().includes(inputValue));
            this.renderAllStudents(detectedStudents);
        }
    }
}