export class DataService {
    constructor () {

    }

    getDictionary() {
        return this.getData(process.env.DICTIONARY_URL);  
    }

    getBuildings() {
        return this.getData(process.env.BUILDINGS_URL)
            // then()// arr to obj, keys are aliaces
    }

    getStudentsList(value) {
        return this.getData(process.env.STUDENTS_URL + value);
    }

    getData(url) { 
        
        return fetch(url)
            .then(response => response.json());
    }
}