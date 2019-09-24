import { DataService } from "./data-service";
import "@babel/polyfill";

export class FormSeating {
    dataServiceInstance = null;

    domElements = {
        appWrapper: null,
        buildingSelectEl: null,
        profileSelectEl: null,
        audienceSelectEl: null,
        inputEl: null,
        allStudentsBody: null,
        allStudentsBodyRow: null,
        seatedStudentsBodyRow: null,
    }

    data = {
        buildings: null,
        dictionary: null,
        facultyAudiences: [],
        currentFaculty: null,
        profiles: [],
        allStudents: null,
    }

    dragAndDropVars = {
        allStudentsTableWidth: null,
        toTheTop: 202,
        tableHeight: null,
        tableY: null,
        tableHeaderHeight: 37,
        fakeRow: null,
        numberOfDraggedRow: null,
    }
    
    sortingVars = {
        sortNameTh: null,
        sortAudienceTh: null,
        sortProfileTh: null,
        sortBelTh: null,
        compareResult: 1,
        sortKey: null,
        sortFlag: false,
    }
    

    

    constructor() {
        this.getDomElements();
        this.dataServiceInstance = new DataService();
        this.getDictionaryData();
        this.getBuildingsSelectData();
        this.addEventListeners();
    }

    getDomElements() {
        this.domElements.appWrapper = document.querySelector(".app-wrapper");
        this.domElements.buildingSelectEl = this.domElements.appWrapper.querySelector(".building");
        this.domElements.profileSelectEl = this.domElements.appWrapper.querySelector(".profile");
        this.domElements.audienceSelectEl = this.domElements.appWrapper.querySelector(".audience");
        this.sortingVars.sortNameTh = this.domElements.appWrapper.querySelector(".sort-name");
        this.sortingVars.sortAudienceTh = this.domElements.appWrapper.querySelector(".sort-audience");
        this.sortingVars.sortProfileTh = this.domElements.appWrapper.querySelector(".sort-profile");
        this.sortingVars.sortBelTh = this.domElements.appWrapper.querySelector(".sort-bel");
        this.domElements.inputEl = this.domElements.appWrapper.querySelector(".search");
        this.domElements.allStudentsBody = this.domElements.appWrapper.querySelector(".all-students #all-body");
        this.domElements.allStudentsBodyRow = this.domElements.appWrapper.querySelector(".all-students #student");
        this.domElements.allStudentsBodyRow.remove();
        this.domElements.seatedStudentsBodyRow = this.domElements.appWrapper.querySelector(".seated-students #seated-row");
        this.domElements.seatedStudentsBodyRow.remove();
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
                this.data.buildings = buildingsObj
                // console.info(this.data.buildings);
                this.renderBuildingsSelect();
            });
    }

    renderBuildingsSelect() {
        for(const buildingData in this.data.buildings) {
            const building = document.createElement("option");

            building.label = this.data.buildings[buildingData].name;
            building.value = this.data.buildings[buildingData].alias;    //TODO: maybe remove?
            building.append(this.data.buildings[buildingData].name);
            this.domElements.buildingSelectEl.append(building);
        }
    }

    getDictionaryData() {
        this.dataServiceInstance.getDictionary()
            .then(dictionaryJson => {
                this.data.dictionary = dictionaryJson
                // console.info(this.data.dictionary);
                
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
        this.renderSelects(this.domElements.profileSelectEl, "Выберите профиль", this.data.currentFaculty);
    }

    renderAudiencesSelect() {
        this.renderSelects(this.domElements.audienceSelectEl, "Выберите аудиторию", this.data.facultyAudiences);
    }

    onBuildingSelected(ev) {
        if (ev.target.className === "building") {
            const value = ev.target.selectedOptions[0].value;
            this.data.currentFaculty = this.data.buildings[value];
            this.dataServiceInstance.getStudentsList(value)
                .then(responseJson => {
                    // console.info(responseJson);
                    this.data.allStudents = responseJson;
                    this.renderAllStudents(responseJson);
                })
                .catch(err => console.error(err));
            
            this.renderSeatedStudents();
            this.dragAndDropVars.tableHeight = document.getElementById("seated").clientHeight - this.dragAndDropVars.tableHeaderHeight;
            this.amountOfRows = this.data.facultyAudiences.length;
            this.rowHeight = this.dragAndDropVars.tableHeight / this.amountOfRows;
            this.dragAndDropVars.tableY = this.dragAndDropVars.tableHeight + this.dragAndDropVars.toTheTop;
            this.renderProfilesSelect();
            this.renderAudiencesSelect();
        }
    }

    selectMethods = {
        "selectProfile": (student, targetValue) => {
            return function () {
                return this.data.dictionary.places[student.place].code === targetValue;
            }.apply(this);
        }, 

        "selectAudience": (student, targetValue) => {
            return function () {
                return this.data.dictionary.audiences[student.audience] === targetValue;
            }.apply(this)
        }
    }

    onSelectChosen(target, method) {
        const targetValue = target.value;
        const filteredStudents = this.data.allStudents.filter(student => this.selectMethods[method](student, targetValue));

        this.renderAllStudents(filteredStudents);
    }

    onProfileSelected(ev) {
        const target = ev.target;

        if (target.className === "profile") {

            this.onSelectChosen(target, "selectProfile");
        }

        // if (ev.target.className === "profile") {
        //     const filteredStudents = this.data.allStudents.filter(student => this.data.dictionary.places[student.place].code === ev.target.value);
        //     this.renderAllStudents(filteredStudents);
        // }
    }

    onAudienceSelected(ev) {
        const target = ev.target;

        if (target.className === "audience") {

            this.onSelectChosen(target, "selectAudience");
        }

        // if (ev.target.className === "audience") {
        //     const filteredStudents = this.data.allStudents.filter(student => this.data.dictionary.audiences[student.audience] === ev.target.value);
        //     this.renderAllStudents(filteredStudents);
        // }
    }

    renderAllStudents(studentsArray) {
        const allStudentsFragment = new DocumentFragment();

        this.clearTableBody(this.domElements.allStudentsBody);

        for (const student of studentsArray) {

            const allStudentsRowTemplate = this.domElements.allStudentsBodyRow.cloneNode(true);
            const tdNumber = allStudentsRowTemplate.querySelector(".td-number");
            const tdName = allStudentsRowTemplate.querySelector(".td-name");
            const tdAudience = allStudentsRowTemplate.querySelector(".td-audience");
            const tdProfile = allStudentsRowTemplate.querySelector(".td-profile");

            tdNumber.append(studentsArray.indexOf(student) + 1);
            tdName.append(student.firstName, ` ${student.lastName}`, ` ${student.parentName}`);
            tdAudience.append(this.data.dictionary.audiences[student.audience]);
            tdProfile.append(this.data.dictionary.profiles[student.profile]);

            if (student.needBel) {
                const tdBel = allStudentsRowTemplate.querySelector(".td-bel");
                this.createBelFlag(tdBel);
            }
            
            allStudentsFragment.append(allStudentsRowTemplate);
        }

        this.domElements.allStudentsBody.append(allStudentsFragment);
    }

    renderSeatedStudents() {
        const seatedSudentsTBody = this.domElements.appWrapper.querySelector(".seated-students tbody");
        const seatedStudentsFragment = new DocumentFragment();
        
        this.clearTableBody(seatedSudentsTBody);
        this.data.facultyAudiences = [];

        this.data.currentFaculty.places.forEach(place => this.data.facultyAudiences.push(...place.audience));

        for (const audience of this.data.facultyAudiences) {
            const seatedStudentsRowTemplate = this.domElements.seatedStudentsBodyRow.cloneNode(true);
            const tdAudience = seatedStudentsRowTemplate.querySelector(".td-audience");
            const tdAmount = seatedStudentsRowTemplate.querySelector(".td-amount");
            const tdMax = seatedStudentsRowTemplate.querySelector(".td-max");
            const tdBel = seatedStudentsRowTemplate.querySelector(".td-bel");

            tdAudience.append(audience.name);
            tdAudience.classList.add("bold");
            tdAmount.append(audience.count);
            tdMax.append(audience.count);

            if (audience.bel) {
                this.createBelFlag(tdBel);
            }

            seatedStudentsRowTemplate.classList.add("row-hower");

            if (audience.count > audience.max) {
                seatedStudentsRowTemplate.classList.add("table-danger");
                seatedStudentsRowTemplate.classList.add("row-hower-danger");
            }

            seatedStudentsFragment.append(seatedStudentsRowTemplate);
        }

        seatedSudentsTBody.append(seatedStudentsFragment);
    }

    createBelFlag(parent) {
        const div = document.createElement("div");
        div.classList.add("flag");
        parent.append(div);
    }

    onMouseDown(ev) {
        if(ev.target.parentNode.id === "student") {
            this.dragAndDropVars.allStudentsTableWidth = ev.target.parentNode.clientWidth;
            this.dragAndDropVars.numberOfDraggedRow = parseInt(ev.target.parentNode.children[0].innerHTML);
            this.dragAndDropVars.fakeRow = this.domElements.allStudentsBodyRow.cloneNode(true);
            this.dragAndDropVars.fakeRow.className = "draggableRow";
            const tdNumber = this.dragAndDropVars.fakeRow.querySelector(".td-number");
            const tdName = this.dragAndDropVars.fakeRow.querySelector(".td-name");
            const tdAudience = this.dragAndDropVars.fakeRow.querySelector(".td-audience");
            const tdProfile = this.dragAndDropVars.fakeRow.querySelector(".td-profile");
            const student = this.data.allStudents[this.dragAndDropVars.numberOfDraggedRow];

            tdNumber.append(this.dragAndDropVars.numberOfDraggedRow);
            tdName.append(student.firstName, ` ${student.lastName}`, ` ${student.parentName}`);
            tdAudience.append(this.data.dictionary.audiences[student.audience]);
            tdProfile.append(this.data.dictionary.profiles[student.profile]);

            if (student.needBel) {
                const tdBel = this.dragAndDropVars.fakeRow.querySelector(".td-bel");
                this.createBelFlag(tdBel);
            }

            this.dragAndDropVars.fakeRow.classList.add("fake-row");
            Array.from(this.dragAndDropVars.fakeRow.children).forEach(child => child.classList.add("fake-row-item"));
            document.body.append(this.dragAndDropVars.fakeRow);
            this.moveAt(ev);
        }
    }

    onMouseMove(ev) {
        if(this.dragAndDropVars.fakeRow) {
            this.moveAt(ev);
        }
    }

    moveAt(ev) {
        this.dragAndDropVars.fakeRow.style.left = ev.pageX - this.dragAndDropVars.fakeRow.offsetWidth / 2 + 'px';
        this.dragAndDropVars.fakeRow.style.top = ev.pageY - this.dragAndDropVars.fakeRow.offsetHeight / 2 + 'px';
    }

    onMouseUp(ev) {
        if(this.dragAndDropVars.fakeRow) {
            const allDraggedRows = document.getElementsByClassName("draggableRow");
            const theLastDraggedRow = allDraggedRows[allDraggedRows.length - 1];
            const mouseX = ev.x;
            const mouseY = ev.y;

            if (mouseY <= this.dragAndDropVars.tableY && mouseY > this.dragAndDropVars.toTheTop && mouseX > this.dragAndDropVars.allStudentsTableWidth) {
                const numberOfDroppedRow = parseInt((mouseY - this.dragAndDropVars.toTheTop) / this.rowHeight) + 1;                
                const targetAudience = this.data.facultyAudiences[numberOfDroppedRow - 1];
                const previousAllStudentsAudience = this.data.allStudents[this.dragAndDropVars.numberOfDraggedRow - 1].audience;

                if (this.checkBel(targetAudience, this.data.allStudents[this.dragAndDropVars.numberOfDraggedRow - 1])) {
                    alert("Попытка посадить белоруса к не белорусам!");

                    this.removeFakeRow(theLastDraggedRow);

                } else if (targetAudience._id !== this.data.allStudents[this.dragAndDropVars.numberOfDraggedRow - 1].audience) {
                    const previousSeatedStudentsAudience = this.data.facultyAudiences.filter(el => el._id === previousAllStudentsAudience);

                    previousSeatedStudentsAudience[0].count --;
                    targetAudience.count ++;
                    this.data.allStudents[this.dragAndDropVars.numberOfDraggedRow - 1].audience = targetAudience._id;
                    const filteredStudents = this.data.allStudents;
                    this.renderSeatedStudents();
                    this.renderAllStudents(filteredStudents);
                }

                this.dragAndDropVars.fakeRow = null;
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
        if (this.data.allStudents && ev.target.className === "sort-name") {
            this.sortHandler("firstName");

        } else if (this.data.allStudents && ev.target.className === "sort-audience") {
            this.sortHandler("audience");

        } else if (this.data.allStudents && ev.target.className === "sort-profile") {
            this.sortHandler("profile");

        } else if (this.data.allStudents && ev.target.className === "sort-bel") {
            this.sortHandler("needBel");
        }
    }

    sortHandler(key) {
        this.sortingVars.sortFlag = !this.sortingVars.sortFlag;
            this.sortingVars.sortFlag ? this.sortingVars.compareResult = 1 : this.sortingVars.compareResult = -1;
            this.sortingVars.sortKey = key;
            const filteredStudents = this.data.allStudents.sort(this.compareCb);
            this.renderAllStudents(filteredStudents);
    }

    compareCb = (firstEl, secondEl) => {
        if (firstEl[this.sortingVars.sortKey] < secondEl[this.sortingVars.sortKey]) {
            return -1 * this.sortingVars.compareResult;
        } else if(firstEl[this.sortingVars.sortKey] > secondEl[this.sortingVars.sortKey]) {
            return this.sortingVars.compareResult;
        } else {
            return 0;
        }
    }

    onInputChanged(ev) {
        if (this.data.allStudents && ev.target.className === "search") {
            const inputValue = ev.target.value.toLowerCase();
            // console.info(inputValue);
            const detectedStudents = this.data.allStudents.filter(student => student.firstName.toLowerCase().includes(inputValue));
            this.renderAllStudents(detectedStudents);
        }
    }
}