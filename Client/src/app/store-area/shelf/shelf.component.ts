import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import Product from 'src/app/model/product';
import { SearchService } from 'src/app/services/search.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-shelf',
  templateUrl: './shelf.component.html',
  styleUrls: ['./shelf.component.css']
})
export class ShelfComponent {
  constructor(private userHttp: UserService, private router: Router,
    private search: SearchService) { }

  category: number = 1;
  productList: Product[] = [];
  selectProduct: number = -1;
  productName: string = "";
  productAmount: number = 1;
  productPrice: number = -1;
  @Output() refreshCart: EventEmitter<number> = new EventEmitter<number>();

  ngOnInit() {
    this.getProductsByCategory();

    this.search.getSearchLetters().subscribe(val => {
      if (val) {//searched keyword
        this.userHttp.getAllProducts().subscribe(productList => {
          let searchedProducts: Product[] = [];
          for (let product of productList) {
            if (product.name.toLocaleLowerCase().includes(val.toLowerCase())) {
              searchedProducts[searchedProducts.length] = product;
            }
          }
          this.productList = searchedProducts;
          this.category = 0;
        });
      }
      else {
        this.categoryChange(1);
      }
    },
      err => {
        if (err.status && err.status === 401)
          this.router.navigate(['home']);
      });

    this.search.setShowSearch(true);
  }

  ngOnDestroy() {
    this.search.setShowSearch(false);
    this.search.setSearchLetters("");
  }

  getProductsByCategory() {
    this.userHttp.getProductsByCategory(this.category)
      .subscribe(
        val => {
          this.productList = val;
        },
        err => {
          if (err.status && err.status === 401)
            this.router.navigate(['home']);
        });
  }

  categoryChange(category: number) {
    this.cancelSelection();
    this.category = category;
    this.getProductsByCategory();
  }

  addProduct(productId: number, productName: string, productPrice: number) {
    if (this.productAmount != 1)
      this.productAmount = 1;
    this.selectProduct = productId;
    this.productName = productName;
    this.productPrice = productPrice;
  }

  confirmSelection() {//add selection to cart
    if (this.productAmount > 0) {
      if (this.productAmount > 100)
        this.productAmount = 100;
      const cartId = JSON.parse(localStorage['cart']).cartId;
      const cartProduct = {
        id: 0,
        cart_id: cartId,
        product_id: this.selectProduct,
        amount: this.productAmount,
        total_price: (this.productAmount * this.productPrice)
      }
      this.userHttp.addProductToCart(cartProduct)
        .then(val => {
          if (val && val.message)
            console.log(val.message);
          this.refreshCart.emit(0);
        },
          err => {
            if (err.status && err.status === 401)
              this.router.navigate(['home']);
          });
    }
    this.cancelSelection();
  }

  cancelSelection() {
    this.selectProduct = -1;
    this.productName = "";
    this.productPrice = -1;
    this.productAmount = 1;
  }

  fixMaxAmount() {
    if (this.productAmount > 100)
      this.productAmount = 100;
  }

  incProductAmount() {
    if (this.productAmount < 100)
      this.productAmount++;
  }

  decProductAmount() {
    if (this.productAmount > 0)
      this.productAmount--;
  }
}
