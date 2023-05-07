import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Customer from '../model/customer';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  constructor(private router: Router, private authHttp: LoginService) { }
  userId: number = 0;
  userEmail: string = "";
  userPass: string = "";
  userPassConfirm: string = "";
  userCity: string = "";
  userStreet: string = "";
  userFirst: string = "";
  userLast: string = "";

  showPass: boolean = false;
  firstError: string = "";
  secondError: string = "";
  formStage: number = 0;

  ngOnInit() {
    if (localStorage.getItem('loginData') && JSON.parse(localStorage['loginData']).token) {
     this.router.navigate(['home']);
    }
  }

  resetErrors() {
    this.firstError = this.secondError = "";
  }

  nextForm() { //check for errors and email/id duplicates on first form
    this.firstError = "";
    const error = this.firstErrorCheck();
    if (error)
      this.firstError = error;
    else {
      if (this.userId) {
        this.authHttp.getExistedInfo(this.userId, this.userEmail)
          .subscribe({
            next: val => {
              this.formStage = 1;
            },
            error: err => {
              this.firstError = err.error.message;
            }
          });
      }
    }
  }

  firstErrorCheck() {
    const validEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    let error = "";
    if (this.userEmail.includes('\'') || this.userPass.includes('\''))
      error = "Please do not use special keys";
    else if (!this.userId)
      error = "ID number is required";
    else if (this.userId < 0 || this.userId < 100000 || this.userId > 999999999)
      error = "Invalid ID number"
    else if (!this.userEmail)
      error = "Email address is required";
    else if (!this.userEmail.match(validEmailRegex))
      error = "Invalid email adress";
    else if (!this.userPass)
      error = "Password is required";
    else if (this.userPass.length < 6)
      error = "Password is too short (min = 6)";
    else if (this.userPass.length > 20)
      error = "Password is too long (max = 20)";
    else if (!this.userPassConfirm)
      error = "Password confirm is required";
    else if (this.userPassConfirm != this.userPass)
      error = "Password confirm isn't match";

    return error;
  }

  finishForm() {//finish register, checking second form's data
    this.secondError = "";
    const error = this.secondErrorCheck();
    if (error)
      this.secondError = error;
    else {
      const newUser: Customer = {
        first_name: this.userFirst,
        last_name: this.userLast,
        email: this.userEmail,
        id: this.userId,
        pass: this.userPass,
        city: this.userCity,
        street: this.userStreet,
        role: ""
      };
      this.authHttp.registerAsync(newUser)
        .then(
          val => {
            if (val?.error)
              console.log(val.error);
            else {
              this.secondError = "Hello " + this.userFirst + "! Registeration completed!";
              let myTimeOut = setTimeout(() => {
                this.router.navigate(['']);
                clearTimeout(myTimeOut);
              }, 2500);
            }
          })
        .catch(
          err => {
            this.firstError = this.secondError = err.error.message;
          });
    }
  }

  secondErrorCheck() {
    let error = "";
    if (this.userFirst.includes('\'') || this.userLast.includes('\'') || this.userLast.includes('\'') || this.userStreet.includes('\'') || this.userCity.includes('\''))
      error = "Please do not use special keys";
    else if (!this.userFirst)
      error = "First name is required";
    else if (this.userFirst.length < 2)
      error = "First name is too short (min = 2)";
    else if (this.userFirst.length > 20)
      error = "First name is too short (max = 20)";
    else if (!this.userLast)
      error = "Last name is required";
    else if (this.userLast.length < 2)
      error = "Last name is too short (min = 2)";
    else if (this.userLast.length > 20)
      error = "Last name is too long (max = 20)";
    else if (!this.userCity)
      error = "City is required";
    else if (this.userCity.length < 2)
      error = "City name is too short (min = 2)";
    else if (this.userCity.length > 20)
      error = "City name is too long (max = 20)";
    else if (!this.userStreet)
      error = "Street is required";
    else if (this.userStreet.length < 2)
      error = "Street name is too short (min = 2)";
    else if (this.userStreet.length > 20)
      error = "Street name is too long (max = 30)";

    return error;
  }

  prevForm() {
    this.formStage = 0;
  }
}
