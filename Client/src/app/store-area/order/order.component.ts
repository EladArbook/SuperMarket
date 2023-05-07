import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Order from 'src/app/model/order';
import ProductInCart from 'src/app/model/productInCart';
import { LoginService } from 'src/app/services/login.service';
import { SearchService } from 'src/app/services/search.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent {
  constructor(private router: Router, private http: UserService,
    private authService: LoginService, private search: SearchService) { }

  cartProducts: ProductInCart[] = [];
  shipCity: string = "";
  shipStreet: string = "";
  shipDate: Date | undefined;
  shipCard: number = 0;
  totalPrice = 0; //product's price * amount
  cityError = "";
  streetError = "";
  dateError = "";
  cardError = "";
  orderSuccess = false;
  searchWord: string = "";

  ngOnInit() {
    if (localStorage.getItem('loginData') && JSON.parse(localStorage['loginData']).role === "admin") {
      this.router.navigate(['admin']); //if admin trying to order navigate him back
    }

    this.authService.checkSessionTime();
    this.getCart();

    this.search.setShowSearch(true); //show search bar

    this.search.getSearchLetters().subscribe(val => {
      if (val) {
        this.searchWord = val;
      }
      else {
        this.searchWord = "";
      }
    },
      err => {
        if (err.status && err.status === 401)
          this.router.navigate(['home']);
      });
  }

  ngOnDestroy() {
    this.search.setShowSearch(false);
    this.search.setSearchLetters("");
  }

  backToShop() {
    this.router.navigate(['cart']);
  }


  getCart() { //get cart's number
    if (localStorage.getItem('loginData') && !JSON.parse(localStorage['loginData']).role) {
      this.http.getCartId(JSON.parse(localStorage['loginData']).id)
        .subscribe(val => {
          localStorage['cart'] = JSON.stringify(val);
          this.getCartProducts();
        },
          err => {
            if (err.status && err.status === 401)
              this.router.navigate(['home']);
          });
    }
  }

  getCartProducts() { //get products in the above cart's id
    this.http.getCartProducts(JSON.parse(localStorage['cart']).cartId)
      .subscribe(val => {
        if (val.length > 0) {
          this.cartProducts = val;
          this.totalPrice = 0;
          for (let product of val) {
            this.totalPrice += Number(product.total_price);
          }
        }
        else {
          this.router.navigate(['cart']);
        }
      },
        err => {
          if (err.status && err.status === 401)
            this.router.navigate(['home']);
        });
  }

  makeOrder() {
    if (!this.checkErrors() && this.shipDate) {
      const shippingDate = new Date(this.shipDate);
      const day = shippingDate.getDate();
      const month = Number(shippingDate.getMonth()) + 1;
      const year = shippingDate.getFullYear();
      const deliveryDate = `${year}-${month}-${day}`;

      this.http.checkAvaDate(deliveryDate)
        .subscribe(val => {
          if (!val.isAvailable) {//check availability (max 3 orders per day)
            this.dateError = "We're full. Please select another date";
          }
          else {//make the order
            const myDate = new Date();
            const orderDate = `${myDate.getFullYear()}-${myDate.getMonth() + 1}-${myDate.getDate()}`;
            const paymentMethod = String(this.shipCard).
              substring(String(this.shipCard).length - 4, String(this.shipCard).length);

            const newOrder: Order = {
              customer_id: JSON.parse(localStorage['loginData']).id,
              cart_id: JSON.parse(localStorage['cart']).cartId,
              summary: this.totalPrice,
              city: this.shipCity,
              street: this.shipStreet,
              delivery_date: deliveryDate,
              order_date: orderDate,
              payment: paymentMethod
            };
            this.http.makeNewOrder(newOrder).then(val => {
              this.search.setShowSearch(true);
              this.orderSuccess = true;
              console.log(val);
            },
              err => {
                if (err.status && err.status === 401)
                  this.router.navigate(['home']);
              });
          }
        },
          err => {//didn't check this
            if (err.status && err.status === 401)
              this.router.navigate(['home']);
          });
    }
  }

  checkErrors() {
    let errors = false;
    const CreditRegEx = /^(?:(4[0-9]{12}(?:[0-9]{3})?)|(5[1-5][0-9]{14})|(6(?:011|5[0-9]{2})[0-9]{12})|(3[47][0-9]{13})|(3(?:0[0-5]|[68][0-9])[0-9]{11})|((?:2131|1800|35[0-9]{3})[0-9]{11}))$/;
    if (!this.shipCity) {
      this.cityError = "*City is missing";
      errors = true;
    }
    else if (this.shipCity.length < 2) {
      this.cityError = "*City name is too short";
      errors = true;
    }
    else if (this.shipCity.length > 20) {
      this.cityError = "*City name is too long";
      errors = true;
    }
    if (!this.shipStreet) {
      this.streetError = "*Street is missing";
      errors = true;
    }
    else if (this.shipStreet.length < 2) {
      this.streetError = "*Street name is too short";
      errors = true;
    }
    else if (this.shipStreet.length > 30) {
      this.streetError = "*Street name is too long";
      errors = true;
    }
    if (!this.shipDate) {
      this.dateError = "*Date is missing";
      errors = true;
    }
    else if (new Date(this.shipDate).getTime() <= (new Date()).getTime()) {
      this.dateError = "*Delivery starting tomorrow";
      errors = true;
    }
    if (!this.shipCard) {
      this.cardError = "*Payment is missing";
      errors = true;
    }
    else if (!CreditRegEx.test(String(this.shipCard))) {
      this.cardError = "*Card number is invalid";
      errors = true;
    }
    return errors;
  }

  getDefaultCity() {//double click
    if (localStorage.getItem('loginData') && JSON.parse(localStorage['loginData']).city) {
      this.shipCity = JSON.parse(localStorage['loginData']).city;
      this.cityError = "";
    }
  }

  getDefaultStreet() {//double click
    if (localStorage.getItem('loginData') && JSON.parse(localStorage['loginData']).street) {
      this.shipStreet = JSON.parse(localStorage['loginData']).street;
      this.streetError = "";
    }
  }

  resetCityError() {
    this.cityError = "";
  }

  resetStreetError() {
    this.streetError = "";
  }

  resetDateError() {
    this.dateError = "";
  }

  resetCardError() {
    this.cardError = "";
  }

  BackHome() {
    this.router.navigate(['home']);
  }

  downloadRecipt() {
    const today = new Date();
    let data = `   Luna Pharm\n   ${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}    \n ______________\n `;
    for (let product of this.cartProducts) {
      data += product.name + " x " + String(product.amount) + "\n         " + product.total_price + "\n ";
    }
    data += `\n Total: ${this.totalPrice} $\n ______________\n We're always here for you
     1-800-000-000
  - LUNA PHARM LTD -    `;
    const file = new Blob([data], { type: 'application/octet-stream' }); //txt file
    const element = document.createElement('a');
    element.href = URL.createObjectURL(file);
    element.download = `Luna Pharm ${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}.txt`;
    element.click();
  }
}
