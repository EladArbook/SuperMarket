import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './layout-area/layout/layout.component';
import { HeaderComponent } from './layout-area/header/header.component';
import { MainComponent } from './layout-area/main/main.component';
import { FooterComponent } from './layout-area/footer/footer.component';
import { LoginComponent } from './login-area/login.component';
import { RegisterComponent } from './register-area/register.component';
import { ShelfComponent } from './store-area/shelf/shelf.component';
import { ShopComponent } from './store-area/shop/shop.component';
import { CartSumComponent } from './store-area/cart-sum/cart-sum.component';
import { OrderComponent } from './store-area/order/order.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TokenInterceptor } from './token.interceptor';
import { ManageComponent } from './admin-area/manage.component';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    HeaderComponent,
    MainComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    ShelfComponent,
    ShopComponent,
    CartSumComponent,
    OrderComponent,
    ManageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
