import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AppComponent} from './app.component';
import {AppRoutingModule, routes} from './app.routes';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthInterceptor} from './feature/auth/interceptors/auth.interceptor';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToastrModule} from 'ngx-toastr';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    AppComponent,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    RouterModule.forRoot(routes),
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
  bootstrap: []
})
export class AppModule { }
