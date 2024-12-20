import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {PurchaseDTO} from '../../model/purchase.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  private apiUrl = 'http://localhost:8088/api/v1/purchase';
  constructor(private http: HttpClient) {}

  private token= localStorage.getItem('token'); // Lấy token từ localStorage

  private headers = new HttpHeaders({
    Authorization: `Bearer ${this.token}` // Gắn Bearer token
  });

  createPurchase(purchaseDTO: PurchaseDTO): Observable<PurchaseDTO> {
    return this.http.post<PurchaseDTO>(`${this.apiUrl}/create`, purchaseDTO, {headers: this.headers});
  }

  getPurchase(id: number): Observable<PurchaseDTO> {
    return this.http.get<PurchaseDTO>(`${this.apiUrl}/${id}`, {headers: this.headers});
  }

  getPurchasesByUser(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/all/${id}`,{headers: this.headers});
  }



}
