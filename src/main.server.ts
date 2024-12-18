import { bootstrapApplication } from '@angular/platform-browser';
import { OrderComponent } from './app/order/order.component'
import {AppComponent} from './app/app.component';
import {HomeComponent} from './app/pages/home/home.component';
import {appConfig} from './app/app.config';

const bootstrap = () => bootstrapApplication(AppComponent,appConfig);

export default bootstrap;
