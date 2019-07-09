import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CartService } from '../cart/cart.service';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
    items: any[];
    checkoutForm: any;

    constructor(
        private cartService: CartService,
        private formBuilder: FormBuilder
    ) {
        this.checkoutForm = this.formBuilder.group({
            name: '',
            address: ''
        });
    }

    ngOnInit() {
    }

    onSubmit(customerData) {
        console.warn('Your order has been submitted', customerData);

        this.items = this.cartService.clearCart();
        this.checkoutForm.reset();
    }

}