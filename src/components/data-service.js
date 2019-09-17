export class DataService {
    dictionary = null;
    buildings = null;

    constructor (renderBuildingsSelect, renderAllStudents) {
        this.renderBuildingsSelect = renderBuildingsSelect;
        this.renderAllStudents = renderAllStudents;
        this.getDictionary();
        this.getBuildings();
    }

    getDictionary() {
        this.getData(process.env.DICTIONARY_URL)
        .then(dictionaryJson => {
            this.dictionary = dictionaryJson
            console.info(this.dictionary);
        })
        .catch(err => console.error(err));        
    }

    getBuildings() {
        this.getData(process.env.BUILDINGS_URL)
        .then(buildingsJson => {
            this.buildings = buildingsJson
            console.info(this.buildings);
            this.renderBuildingsSelect(this.buildings);
        })
        .catch(err => console.error(err));
    }

    getStudentsList(value) {
        return this.getData(process.env.STUDENTS_URL + value);
    }

    getData(url) { 
        
        return fetch(url)
            .then(response => response.json());
    }
}