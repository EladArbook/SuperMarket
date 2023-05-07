import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { timeout } from 'rxjs';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(private router: Router, private search: SearchService) { }
  searchInput = "";
  searchToggle: boolean = false; //show search bar?
  userName = ""; //hello user name
  logOutBtn = false; //show log-out button

  ngOnInit() {// SHOW / HIDE search bar
    this.search.getShowSearch().subscribe(val => { // Show/Hide search bar

      if (val === true && this.searchToggle === false) { //show
        let myTimeOut = setTimeout(() => {
          this.searchInput = "";
          this.searchToggle = val;
          clearTimeout(myTimeOut);
        }, 0);
      }
      else { //hide
          this.searchToggle = false;
      }
    });

    this.search.getUserName().subscribe(val => {
      this.userName = val;
      if (val === "ADMIN")
        this.logOutBtn = true;
      else
        this.logOutBtn = false;
    });

    if ((localStorage.getItem('loginData'))) {
      this.userName = JSON.parse(localStorage['loginData']).first_name.toUpperCase();
      if (localStorage.getItem('loginData') && JSON.parse(localStorage['loginData']).role === "admin") {

        this.logOutBtn = true;
        if (JSON.parse(localStorage['loginData']).role === "admin") {

          this.logOutBtn = true;
        }
      }
    }
  }

  redirectHome() {
    this.router.navigate(['home']);
  }

  trigInput() {//change input to search and show found products
    this.search.setSearchLetters(this.searchInput);
  };

  adminLogOut() {
    if (localStorage.getItem('loginData'))
      localStorage.removeItem('loginData');
    if (localStorage.getItem('loginTime'))
      localStorage.removeItem('loginTime');
    this.userName = "";
    this.logOutBtn = false;
    this.redirectHome();
  }
}
