import { Component, OnInit } from '@angular/core';
import { Product, Phone } from './classes';
import { HttpClient } from '@angular/common/http';
import { IPhone } from './classes';
import { Android } from './classes';
import { Tablet } from './classes';
import { TV } from './classes';
import { FilterService } from './product-filter/filter.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  allPhones: Phone[] = [];
  iPhones: IPhone[] = [];
  androids: Android[] = [];
  tablets: Tablet[] = [];
  tvs: TV[] = [];



  filteredProducts: string[] = [];

  subscription: Subscription;

  constructor(
    private http: HttpClient,
    private filterService: FilterService
  ) {

  }

  ngOnInit() {
    this.getProducts().subscribe((products: Object[]) => {
      this.getProductTypes(products);
    });

    this.subscription = this.filterService.filteredProducts
      .subscribe(item => this.filteredProducts = item);
  }

  getProducts(): Observable<object> {
    return this.http.get('products.json');
  }

  getProductTypes(prodArray: any[]): void {
    const phonesArr = prodArray.filter(el => el["type"] === "phone");
    const tabletsArr = prodArray.filter(el => el["type"] === "tablet");
    const tvsArr = prodArray.filter(el => el["type"] === "TV");

    this.allPhones = phonesArr.map(el => new Phone(el));
    this.tablets = tabletsArr.map(el => new Tablet(el));
    this.tvs = tvsArr.map(el => new TV(el));

    const iphonesArr = phonesArr.filter(el => el["OS"] === "iOS");
    this.iPhones = iphonesArr.map(el => new IPhone(el));

    const androidsArr = phonesArr.filter(el => el["OS"] === "Android");
    this.androids = androidsArr.map(el => new Android(el));
  }

  beautifulPrint(): void {
    this.runPrint(this.allPhones);
    this.runPrint(this.tablets);
    this.runPrint(this.tvs);
    this.runPrint(this.iPhones);
    this.runPrint(this.androids);
  }

  runPrint(arr: Product[]): void {
    for (const item of arr) {
      item.print();
    }
  }
}
