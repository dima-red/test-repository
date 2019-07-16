import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class FilterService {
    private valuesArr: string[] = [];

    public filteredProducts: EventEmitter<string[]> = new EventEmitter<string[]>();

    public getFilteredItems(item) {
        if (this.valuesArr.includes(item)) {
            this.valuesArr.splice(this.valuesArr.indexOf(item), 1)
        } else {
            this.valuesArr.push(item);
        }

        this.filteredProducts.emit(this.valuesArr);
    }
}