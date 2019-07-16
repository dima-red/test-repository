import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { products } from '../products';
import { FormControl } from '@angular/forms';
import { FilterService } from './filter.service';

@Component({
  selector: 'product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.css']
})

export class ProductFilterComponent implements OnInit {

  @Output() filteredProducts: EventEmitter<string[]> = new EventEmitter<string[]>();

  valuesArr: string[] = [];
  filter = new FormControl();
  filteredList: string[] = ["All Phones", "iPhones", "Android phones", "Tablets", "TVs"];

  constructor(
    private filterService: FilterService
  ) {

  }

  ngOnInit() {

  }

  clickHandler(item: string) {
    if (this.valuesArr.includes(item)) {
      this.valuesArr.splice(this.valuesArr.indexOf(item), 1)
    } else {
      this.valuesArr.push(item);
    }

    this.filteredProducts.emit(this.valuesArr);

    // if (this.valuesObj[item]) {
    //   this.valuesObj[item] = !this.valuesObj[item];

    // } else {
    //   this.valuesObj[item] = true;
    // }
    
    // this.filteredProducts.emit(this.valuesObj);

    // this.filterService.getFilteredItems(item);
  }
}