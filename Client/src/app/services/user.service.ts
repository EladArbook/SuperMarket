import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/enviroments/enviroment';
import Product from '../model/product';
import CartProduct from '../model/cartProduct';
import Order from '../model/order';
import ProductInCart from '../model/productInCart';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }
  BASE_URL = environment.serverUrl + '/user';

  getAllProducts() {
    return this.http.get<Product[]>(`${this.BASE_URL}/allProducts`)
  }

  getProductsAndOrders() { //NO LOGIN REQUIRED
    return this.http.get<{ products: number, orders: number }>(`${this.BASE_URL}/generalInfo`)
  }

  getLastOrder(id: number) {
    return this.http.get<{ date: Date, total: number }>(`${this.BASE_URL}/lastOrder/${id}`);
  }

  getProductsByCategory(categoryId: number) {
    return this.http.get<Product[]>(`${this.BASE_URL}/productsByCategory/${categoryId}`);
  }

  createCart(customerId: number) {
    return this.http.post<{ message: string }>(`${this.BASE_URL}/createCart`, { id: customerId }).toPromise();
  }

  getCartId(customerId: number) {
    return this.http.get<{ cartId: number }>(`${this.BASE_URL}/getCartId/${customerId}`);
  }

  getCartProducts(cartId: number) {
    return this.http.get<ProductInCart[]>(`${this.BASE_URL}/getCartProducts/${cartId}`);
  }

 addProductToCart(cartProduct: CartProduct) {
    return this.http.post<{ message: string }>(`${this.BASE_URL}/addToCart`, cartProduct).toPromise();
  }

  removeProduct(productId: number, cartId: number) {
    return this.http.delete<{ message: string }>(`${this.BASE_URL}/deleteProduct/${productId}/${cartId}`).toPromise();
  }

   deleteAllProducts(cartId: number) {
    return this.http.delete<{ message: string }>(`${this.BASE_URL}/deleteAll/${cartId}`).toPromise();
  }

  checkAvaDate(deliveryDate: string) {
    return this.http.get<{ isAvailable: boolean }>(`${this.BASE_URL}/orderPerDay/${deliveryDate}`);
  }

  makeNewOrder(newOrder: Order) {
    return this.http.post<{ message: string }>(`${this.BASE_URL}/newOrder`, newOrder).toPromise();
  }
}
