import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent {
  constructor(private router: Router, private authService: LoginService) { }
  minimized = false;
  refresher: number = 0;

  ngOnInit() {
    if (localStorage.getItem('loginData') && JSON.parse(localStorage['loginData']).role === "admin") {
      this.router.navigate(['admin']);//if admin arrives, sending him back
    }
    this.authService.checkSessionTime();
  }

  refreshCartSum(eventEmit: number) {
    if (this.refresher === 1)
      this.refresher = 2;
    else
      this.refresher = 1;
  }

  minimizeMenu(size: number) {//0 = minimized, 1 = original size
    if (size === 0)
      this.minimized = true;
    else
      this.minimized = false;
  }
  
  /*  */
  handleErrors(errorCode: number) {
    console.log(errorCode);
    if (errorCode === 401) {
      if (localStorage.getItem('loginData'))
        localStorage.removeItem('loginData');
      if (localStorage.getItem('loginTime'))
        localStorage.removeItem('loginTime');
      this.router.navigate(['home']);
    }
  }

}
