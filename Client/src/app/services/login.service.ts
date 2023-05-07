import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/enviroments/enviroment';
import Customer from '../model/customer';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient, private router: Router) { }
  BASE_URL = environment.serverUrl + '/auth';

  loginAsync(email: string, pass: string) {
    return this.http.post<Customer>(`${this.BASE_URL}/login`, { username: email, password: pass })        
      .toPromise();
  }

  getExistedInfo(id: number, email: string) {//register's duplicate check
    return this.http.get<{message: string}>(`${this.BASE_URL}/checkExists/${id}/${email}`);
  }

  registerAsync(newUser: Customer) {
    return this.http.post<{ error: string }>(`${this.BASE_URL}/register`, newUser).toPromise();
  }

  checkSessionTime() {
    if (localStorage.getItem('loginData') && localStorage.getItem('loginTime')) {

      const loginTime = new Date(JSON.parse(localStorage['loginTime']));
      const currentTime = new Date();
      if (currentTime.getTime() - loginTime.getTime() > 3600000) {
        console.log("Login session expired");
        localStorage.removeItem('loginData');
        localStorage.removeItem('loginTime');
        this.router.navigate(['home']);
      }
    }
    else {
      if (localStorage.getItem('loginTime'))
        localStorage.removeItem('loginTime');
      if (localStorage.getItem('loginData'))
        localStorage.removeItem('loginData');

      this.router.navigate(['home']);
    }
  }


}
