import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageComponent } from './admin-area/manage.component';
import { LoginComponent } from './login-area/login.component';
import { RegisterComponent } from './register-area/register.component';
import { OrderComponent } from './store-area/order/order.component';
import { ShopComponent } from './store-area/shop/shop.component';

const routes: Routes = [
  {
    path: "home",
    component: LoginComponent
  },
  {
    path: "register",
    component: RegisterComponent
  },
  {
    path: "cart",
    component: ShopComponent
  },
  {
    path: "order",
    component: OrderComponent
  },
  {
    path: "admin",
    component: ManageComponent
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
