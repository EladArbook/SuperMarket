import { Component } from '@angular/core';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { SearchService } from '../services/search.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private router: Router, private authHttp: LoginService,
    private userHttp: UserService, private search: SearchService) { }

  username: string = "";
  password: string = "";
  showPass: boolean = false;
  loginError: string = "";
  loggedIn = false;
  sumOfProducts = 0;
  sumOfOrders = 0;
  cartTotalPrice = -1;
  cartOrderDate: string = "";
  shoppingBtn = "";
  createNewCart = false;
  userFirst = "";

  ngOnInit() {
    if (localStorage.getItem('loginData')) {//checking if login time has expired
      const loginTime = new Date(JSON.parse(localStorage['loginTime']));
      const currentTime = new Date();
      if (currentTime.getTime() - loginTime.getTime() > 3600000) { 
        console.log("Login session expired");
        this.search.setShowSearch(false);
        this.logOut(); 
      }
      else {
        this.logInProccess();
      }
    }

    this.userHttp.getProductsAndOrders()//general info for guests too
      .subscribe(
        val => { // total sum of orders & products on website
          this.sumOfProducts = val.products;
          this.sumOfOrders = val.orders;
        },
        err => {
          console.log(err);
        });
    this.search.setShowSearch(false);
  }

  checkInfo() { //check login details before send for validating
    const validEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    let errors = "";
    if (!this.username)
      errors = "Email address is required";
    else if (!this.password)
      errors = "Password is Required";
    else if (!this.username.match(validEmailRegex))
      errors = "Invalid email adress";
    else if (this.password.length < 6)
      errors = "Password is too short";
    else if (this.password.length > 20)
      errors = "Password is too long";

    return errors;
  }

  changePassShow() { // show/hide password
    if (this.showPass)
      this.showPass = false;
    else
      this.showPass = true;
  }

  login() {
    this.loginError = "";
    const errors = this.checkInfo();
    if (errors) {
      this.loginError = errors;
    }
    else {
      this.authHttp.loginAsync(this.username, this.password)
        .then( // login success
          val => {
            if (val) {
              localStorage['loginData'] = JSON.stringify(val); // save user's data
              let myDate = new Date();
              localStorage['loginTime'] = JSON.stringify(myDate); //save logged-in time
              this.logInProccess();
            }
          },
          err => { // login  failed
            this.loginError = err.error.message;
          })
          .catch(err => {
            console.log(err);
          });
    }
  }

  logInProccess() {
    try {
      //change username on header
      this.loggedIn = true;
      this.search.setUserName(JSON.parse(localStorage['loginData']).first_name.toUpperCase())

      //getting last order / waiting cart
      const userId = JSON.parse(localStorage['loginData']).id;
      if (JSON.parse(localStorage['loginData']).role === "") {
        this.userHttp.getLastOrder(userId)
          .subscribe(
            val => {
              if (val.date && val.total > -1) { // open cart
                let myDate = new Date(val.date);
                this.cartOrderDate = `${myDate.getDate()}/${myDate.getMonth() + 1}/${myDate.getFullYear()}`;
                this.cartTotalPrice = val.total;
                this.shoppingBtn = "Continue shopping";
              }
              else if (val.date) { // last order
                let myDate = new Date(val.date);
                this.cartOrderDate = `${myDate.getDate()}/${myDate.getMonth() + 1}/${myDate.getFullYear()}`;
                this.shoppingBtn = "Start shopping";
                this.createNewCart = true;
              }
              else { // first time
                this.shoppingBtn = "Start your first-time shopping with us!"
                this.createNewCart = true;
              }
            },
            err => {
              if (err.status && err.status === 401)
                this.logOut();
            }
          );
      }
      else if (JSON.parse(localStorage['loginData']).role === "admin") {
        /* && JSON.parse(localStorage['loginData']).id === 555555 */  
        //--- checks for id too - if only 1 admin---\\
        this.router.navigate(['admin']);
      }
    }
    catch {
      this.logOut();
    }
  }

  toCart() {
    if (JSON.parse(localStorage['loginData']).role === "") {
      if (this.createNewCart) {
        this.userHttp.createCart(JSON.parse(localStorage['loginData']).id)
          .then(
            val => {
              console.log(val?.message);
              this.router.navigate(['cart']);
            }
          );
      }
      else
        this.router.navigate(['cart']);
    }
  }

  logOut() {
    this.search.setUserName("");
    localStorage.removeItem('loginData');
    localStorage.removeItem('loginTime');
    this.loggedIn = false;
    this.username = this.password = this.cartOrderDate = this.shoppingBtn = "";
    this.cartTotalPrice = -1;
  }
}
