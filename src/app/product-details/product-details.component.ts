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
      const id = params.get('productId');
      const index = parseInt(id, 10);

      this.product = products[index];
    });
  }

  addToCart(product) {
    alert("Your product has been added to the cart!");
    this.cartService.addToCart(product);
  }
}