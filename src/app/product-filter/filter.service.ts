import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class FilterService {
    valuesObj = {};

    constructor() {

    }

    getFilteredItems(item) {
        // if (this.valuesObj[item]) {
        //     this.valuesObj[item] = !this.valuesObj[item];
            
        // } else {
        //     this.valuesObj[item] = true;
        // }
        // return this.valuesObj;
    }
}