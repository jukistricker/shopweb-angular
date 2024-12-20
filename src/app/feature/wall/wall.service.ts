import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {ProductDTO} from '../../model/product.model';

@Injectable({
  providedIn: 'root'
})
export class WallService {
  private apiUrl = 'http://localhost:8088/api/v1/product';
  constructor(private http: HttpClient) {}

  private token= localStorage.getItem('token'); // Lấy token từ localStorage

  private headers = new HttpHeaders({
    Authorization: `Bearer ${this.token}` // Gắn Bearer token
  });

  getProductByUserId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/${id}`);
  }

  //"api/v1/product/user/{id}"


}
