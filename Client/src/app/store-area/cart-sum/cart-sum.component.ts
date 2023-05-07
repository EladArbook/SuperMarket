import { Component, Output, EventEmitter, Input, SimpleChange } from '@angular/core';
import { Router } from '@angular/router';
import ProductInCart from 'src/app/model/productInCart';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-cart-sum',
  templateUrl: './cart-sum.component.html',
  styleUrls: ['./cart-sum.component.css']
})
export class CartSumComponent {
  constructor(private http: UserService, private router: Router) { }
  @Output() minimizing: EventEmitter<number> = new EventEmitter<number>();
  @Input() refreshCart: number = 0;

  totalPrice = 0; //total cart's summary
  cartProducts: ProductInCart[] = [];
  minimized = false;


  ngOnInit() {
    this.getCart();
  }

  ngOnChanges() {
    this.getCartProducts();
  }

  getCart() {
    if (localStorage.getItem('loginData') && !JSON.parse(localStorage['loginData']).role) {//if logged in and normal user
      this.http.getCartId(JSON.parse(localStorage['loginData']).id)//get cart's id
        .subscribe(
          val => {
            localStorage['cart'] = JSON.stringify(val);
            this.getCartProducts();
          },
          err => {
            if (err.status && err.status === 401)//logged out by session timed out
              this.router.navigate(['home']);
          });
    }
  }

  getCartProducts() {//get existing products in cart by cart's id
    this.http.getCartProducts(JSON.parse(localStorage['cart']).cartId)
      .subscribe(val => {
        this.cartProducts = val;
        this.totalPrice = 0;
        for (let product of val) {
          this.totalPrice += Number(product.total_price);
        }
      },
        err => {
          if (err.status && err.status === 401)//logged out by session timed out
            this.router.navigate(['home']);
        });
  }

  removeProduct(productId: number) {
    this.http.removeProduct(productId, JSON.parse(localStorage['cart']).cartId)
      .then(val => {
        if (val && val.message)
          console.log(val.message);
        this.getCartProducts();
      },
        err => {
          if (err.status && err.status === 401)//logged out by session timed out
            this.router.navigate(['home']);
        });
  }

  deleteAllProducts() {//from cart
    if (confirm("Do you want to remove all products from your cart ?"))
      this.http.deleteAllProducts(JSON.parse(localStorage['cart']).cartId)
        .then(val => {
          if (val && val.message)
            console.log(val.message);
          this.getCartProducts();
        },
        err => {
          if (err.status && err.status === 401)//logged out by session timed out
          this.router.navigate(['home']);
        });
  }

  minimizeWindow() {
    if (this.minimized) {
      this.minimized = false;
      this.minimizing.emit(1)
    }
    else {
      this.minimized = true;
      this.minimizing.emit(0)
    }
  }

  toOrder() {
    if (this.totalPrice > 0) {
      this.router.navigate(['order']);
    }
  }
}
