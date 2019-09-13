export class DataService {
    dictionary = null;
    buildings = null;

    constructor (renderBuildings, renderAllStudents) {
        this.renderBuildings = renderBuildings;
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
        try {
            this.getData(process.env.BUILDINGS_URL)
            .then(buildingsJson => {
                this.buildings = buildingsJson
                console.info(this.buildings);
                this.renderBuildings(this.buildings);
            });
        } catch (err) {
            console.error(err);
        }
    }

    getStudentsList(value) {
        try {
            this.getData(process.env.STUDENTS_URL + value)
            .then(responseJson => this.renderAllStudents(responseJson));
        } catch (err) {
            console.error(err);
        }
    }

    getData(url) { 
        
        return fetch(url)
            .then(response => response.json());
    }
}