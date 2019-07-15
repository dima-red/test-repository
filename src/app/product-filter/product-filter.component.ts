import { Component } from '@angular/core';
import { products } from '../products';
import {FormControl} from '@angular/forms';
import { FilterService } from './filter.service';

@Component({
  selector: 'product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.css']
})
export class ProductFilterComponent {
  valuesObj = {};
  filter = new FormControl();
  filteredList: string[] = ["All Phones", "iPhones", "Android phones", "Tablets", "TVs"];

  constructor(
    private filterService: FilterService
  ) {

  }

  clickHandler(item) {
    this.filterService.getSelectedItems(item);
  }
}