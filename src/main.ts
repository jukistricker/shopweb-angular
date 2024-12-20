import { bootstrapApplication } from '@angular/platform-browser';
import { OrderComponent } from './app/feature/order/order.component';
import {AppComponent} from './app/app.component';
import {HomeComponent} from './app/pages/home/home.component';
import {appConfig} from './app/app.config';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
