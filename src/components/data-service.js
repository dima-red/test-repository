export class DataService {
    constructor () {

    }

    getDictionary() {
        return this.getData(process.env.DICTIONARY_URL);  
    }

    getBuildings() {
        return this.getData(process.env.BUILDINGS_URL)
                .then(buildngsJSON => this.arrayToObject(buildngsJSON))
                .catch(err => console.error(err));
    }

    arrayToObject(arr) {
        const obj = {};

        arr.forEach(item => obj[item.alias] = item);

        return obj;
    }

    getStudentsList(value) {
        return this.getData(process.env.STUDENTS_URL + value);
    }

    getData(url) { 
        
        return fetch(url)
            .then(response => response.json());
    }
}