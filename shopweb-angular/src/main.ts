import { bootstrapApplication } from '@angular/platform-browser';
import { OrderComponent } from './app/order/order.component';

bootstrapApplication(OrderComponent)
  .catch((err) => console.error(err));
