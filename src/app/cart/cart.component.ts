import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart/cart.service';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
    items: any;
    constructor(
        private cartService: CartService
    ) {
        this.items = this.cartService.getItems();
    }

    ngOnInit() {
    }

}