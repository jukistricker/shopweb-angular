import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {CartItemDTO} from '../../../model/cart-item.model';
import {CartDTO} from '../../../model/cart.model';
import {CategoryDTO} from '../../../model/category.model';

@Injectable({
  providedIn: 'root'
})
export class CartItemService {
  private apiUrl = 'http://localhost:8088/api/v1/cart-item';

  private token= localStorage.getItem('token');

  private headers = new HttpHeaders({
    Authorization: `Bearer ${this.token}` // Gắn Bearer token
  });
  constructor(private router: Router,
              private http: HttpClient) { }

  getCartItems(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/all/${id}`, {headers: this.headers});
  }

  getCartItem(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, {headers: this.headers});
  }


  updateCartItem(id: number, cartItem: CartItemDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/update/${id}`, cartItem, {headers: this.headers});
  }

  createCartItem(cartItem: CartItemDTO): Observable<CartItemDTO> {


    return this.http.post<CartItemDTO>(`${this.apiUrl}/create`, cartItem, { headers: this.headers });
  }

  deleteCartItem(id: number) {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, {headers: this.headers});
  }




}
