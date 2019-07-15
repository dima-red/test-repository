import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class FilterService {
    valuesObj = {};

    constructor() {

    }

    getSelectedItems(item) {
        if (this.valuesObj[`${item}`]) {
            this.valuesObj[`${item}`] = !this.valuesObj[`${item}`];
            return this.valuesObj;
        } else {
            this.valuesObj[`${item}`] = true;
            return this.valuesObj;
        }
    }
}