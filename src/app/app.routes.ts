import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {HomeComponent} from './pages/home/home.component';
import {AdminDashboardComponent} from './admin/admin-dashboard/admin-dashboard.component';
import {AdminLayoutComponent} from './admin/admin-layout/admin-layout.component';
import {LoginComponent} from './feature/auth/login/login.component';
import {CategoryComponent} from './admin/admin-sidebar/category/category.component';
import {UserComponent} from './admin/admin-sidebar/user/user.component';


export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children:[

    ]

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
      }

      // Các route khác của admin
    ],
  },
  {
    path:'login',
    component:LoginComponent
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports:[RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
