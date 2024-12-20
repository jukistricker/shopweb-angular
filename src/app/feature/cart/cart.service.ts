import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {CartDTO} from '../../model/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiUrl = 'http://localhost:8088/api/v1/cart';

  private token= localStorage.getItem('token');

  private headers = new HttpHeaders({
    Authorization: `Bearer ${this.token}` // Gắn Bearer token
  });


  constructor(private router: Router,
              private http: HttpClient) {}

  getCartById(id: number): Observable<CartDTO> {
    return this.http.get<CartDTO>(`${this.apiUrl}/getById/${id}`, {headers: this.headers});
  }


}
