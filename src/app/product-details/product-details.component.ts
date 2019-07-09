import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { products } from '../products';
import { CartService } from '../cart/cart.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})

export class ProductDetailsComponent implements OnInit {
    product: any;
    constructor (
        private route: ActivatedRoute,
        private cartService: CartService
    ) {
      
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
        this.product = products[+params.get('productId')];
    });
  }

  addToCart(product) {
    alert("Your product has been added to the cart!");
    this.cartService.addToCart(product);
  }
}

// interface IPerson {
//     name: string;
//     lastName: string;
// }

// class Person implements IPerson {
//     public name: string = 'Dima';
//     public lastName: string = 'La la la a';

//     private address: string;

//     public setAddress(newadress: string): void {
//         this.address = newadress;
//     }

//     print() {
//         console.log(`Hello! My name is ${this.name} ${this.lastName}. I live in ${this.address}`)
//     }
// }

// const dima = new Person()

// dima.print();

// dima.setAddress("Chicago");

// dima.print();

// const andrew2 = new Person();

// andrew2.name = 'Andrew';

// andrew2.print();