import { bootstrapApplication } from '@angular/platform-browser';
import { OrderComponent } from './app/order/order.component'
import { AppComponent } from './app/app.component';
import { ProductDetailComponent } from './app/product-detail/product-detail.component';

const bootstrap = () => bootstrapApplication(ProductDetailComponent);

export default bootstrap;
