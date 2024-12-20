import {Component, Input, OnInit} from '@angular/core';
import {CurrencyPipe, NgFor, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {PurchaseItemDTO} from '../../../model/purchase-item.model';
import {PurchaseItemService} from './purchase-item.service';

@Component({
  selector: 'app-purchase-item',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, CurrencyPipe,],
  templateUrl: './purchase-item.component.html',
  styleUrl: './purchase-item.component.scss'
})
export class PurchaseItemComponent implements OnInit {
  purchaseItems: PurchaseItemDTO[] = [];
  newPurchaseItem: any = {
    id: 0,
    product: null,
    quantity: 1,
    price: 0,
    purchase: null,
  }; // Initialize empty purchase item

  errorMessage: string = '';
  @Input() purchaseId!: number;

  constructor(private purchaseItemService: PurchaseItemService) {}

  ngOnInit(): void {
    // Load purchase items for a specific purchase (optional, based on your logic)
    if (this.purchaseId!=null){

    }
  }




}
