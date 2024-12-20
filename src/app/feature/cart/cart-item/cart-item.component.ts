import { Component, Input, OnInit } from '@angular/core';
import { CartItemService } from './cart-item.service';
import { CartItemDTO } from '../../../model/cart-item.model';
import { VariantAttributeDTO } from '../../../model/variant-attribute.model';
import {CurrencyPipe, NgFor, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {CartDTO} from '../../../model/cart.model';
import {PurchaseItemDTO} from '../../../model/purchase-item.model';
import {PurchaseItemService} from '../../purchase/purchase-item/purchase-item.service';
import {PurchaseService} from '../../purchase/purchase.service';
import {PurchaseDTO} from '../../../model/purchase.model';
import {PaymentService} from '../../../admin/admin-sidebar/payment/payment.service';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../../auth/auth.service';
import {OrderService} from '../../order/order.service';
import {PaymentDTO} from '../../../model/payment.model';
import {UserService} from '../../../admin/admin-sidebar/user/user.service';
import {UserDTO} from '../../../model/user.model';
import {OrderDTO} from '../../../model/order.model';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, CurrencyPipe,],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.scss'
})
export class CartItemComponent  {

}
