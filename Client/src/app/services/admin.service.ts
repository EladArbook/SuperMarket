import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }
  BASE_URL = environment.serverUrl + '/admin';


  newProduct(product: FormData) {
    return this.http.post<{ message: string }>(`${this.BASE_URL}/newProduct`, product).toPromise();
  }

  editProduct(product: FormData) {
    return this.http.patch<{ message: string }>(`${this.BASE_URL}/editProduct`, product).toPromise();
  }

}
