export class FormSeating {
    buildings = null;
    dictionary = null;
    appWrapper = null;
    data = null;

    constructor() {
        this.appWrapper = document.querySelector(".app-wrapper");
        this.buildingSelectEl = this.appWrapper.querySelector(".building");
        this.buildingSelectEl.addEventListener("change", this.onBuildingSelected.bind(this));
        this.getBuildings();
        this.getDictionary();

        
    }

    getBuildings() {
        fetch("https://lyceumexams.herokuapp.com/api/corpses")
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
            building.append(`${buildingData.name}`);
            this.buildingSelectEl.append(building);
        }
    }

    onBuildingSelected(ev) {
        const value = ev.target.selectedOptions[0].value;

        this.getStudentsList(value);
    }

    getStudentsList(value) {
        fetch(`https://lyceumexams.herokuapp.com/api/pupils?corps=${value}`)
            .then(response => response.json())
            .then(responseJson => this.renderAllStudents(responseJson));
    }

    renderAllStudents(allStudents) {
        console.log(allStudents);
        
        const tBodyEl = this.appWrapper.querySelector(".all-students tbody");


        for(const student of allStudents) {
            console.log(student);

            const tr = document.createElement("tr");
            const tdNumber = document.createElement("td");
            const tdName = document.createElement("td");
            const tdRoom = document.createElement("td");
            const tdType = document.createElement("td");
            const tdNeedBel = document.createElement("td");

            tdNumber.append(allStudents.indexOf(student) + 1);
            tdName.append(student.firstName, ` ${student.lastName}`, ` ${student.parentName}`);
            tdRoom.append();
        }        
    }

    renderSeatedStudents() {

    }

    getDictionary() {
        fetch("https://lyceumexams.herokuapp.com/api/dictionary")
            .then(response => response.json())
            .then(dictionaryJson => {
                this.dictionary = dictionaryJson
                console.log(this.dictionary);
            });
    }

    getGeneratedStatus() {
        fetch("https://lyceumexams.herokuapp.com/api/generateStatus")
        .then(response => response.json())
        .then(statusJson => console.log(statusJson));
    }

    // getData(url) {        
    //     fetch(url)
    //         .then(response => response.json())
    //         .then(responseJson => this.data = responseJson);

    //     // what should I return?
    // }
}