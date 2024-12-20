import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {HomeComponent} from './pages/home/home.component';
import {AdminDashboardComponent} from './admin/admin-dashboard/admin-dashboard.component';
import {AdminLayoutComponent} from './admin/admin-layout/admin-layout.component';
import {LoginComponent} from './feature/auth/login/login.component';
import {CategoryComponent} from './admin/admin-sidebar/category/category.component';
import {UserComponent} from './admin/admin-sidebar/user/user.component';
import {ProductComponent} from './admin/admin-sidebar/product/product.component';
import {WallComponent} from './feature/wall/wall.component';
import {ProductDetailComponent} from './pages/product-detail/product-detail.component';
import {SupportComponent} from './pages/home/support/support.component';
import {AboutComponent} from './pages/home/about/about.component';
import {CartComponent} from './feature/cart/cart.component';
import {CartItemComponent} from './feature/cart/cart-item/cart-item.component';
import {OrderComponent} from './feature/order/order.component';
import {PurchaseComponent} from './feature/purchase/purchase.component';
import {PaymentComponent} from './admin/admin-sidebar/payment/payment.component';
import {RegisterComponent} from './feature/register/register.component';


export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children:[

    ]

  },
  {path: 'support', component: SupportComponent},
  {path:'about', component: AboutComponent},
  {path: 'wall/:id', component: WallComponent},
  {path:'product/:id',component:ProductDetailComponent,

  },
  {
    path:'cart', component: CartComponent,
    children:[
      {path:'cart-item',component: CartItemComponent},
    ]
  },
  {
    path:'order', component: OrderComponent,
  },
  {
    path:'purchase',component: PurchaseComponent,
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      {
        path: 'category', component: CategoryComponent
      },
      {
        path: 'user', component: UserComponent
      },
      {
        path: 'product', component: ProductComponent
      },
      {
        path: 'payment', component: PaymentComponent
      }

      // Các route khác của admin
    ],
  },
  {
    path:'login',
    component:LoginComponent
  },
  {
    path:'register',
    component:RegisterComponent
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports:[RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
