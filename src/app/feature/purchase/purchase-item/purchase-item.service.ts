import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {PurchaseItemDTO} from '../../../model/purchase-item.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PurchaseItemService {
  private apiUrl = 'http://localhost:8088/api/v1/item';
  constructor(private http: HttpClient) {}

  private token= localStorage.getItem('token'); // Lấy token từ localStorage

  private headers = new HttpHeaders({
    Authorization: `Bearer ${this.token}` // Gắn Bearer token
  });

  createPurchaseItem(purchaseItemDTO: PurchaseItemDTO): Observable<PurchaseItemDTO> {
    return this.http.post<PurchaseItemDTO>(`${this.apiUrl}/create`, purchaseItemDTO, {headers: this.headers});
  }

  getPurchaseItem(id: number): Observable<PurchaseItemDTO> {
    return this.http.get<PurchaseItemDTO>(`${this.apiUrl}/${id}`, {headers: this.headers});

  }
  updatePurchaseItem(id:number, purchaseItemDto: PurchaseItemDTO): Observable<PurchaseItemDTO> {
    return this.http.post<PurchaseItemDTO>(`${this.apiUrl}/update/${id}`, purchaseItemDto, {headers: this.headers});
  }

  getPurchaseItemsByPurchase(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/all/${id}`, {headers: this.headers});
  }

}
