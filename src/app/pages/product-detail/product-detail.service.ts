import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ProductDTO} from '../../model/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductDetailService {

  private apiUrl = 'http://localhost:8088/api/v1/product';
  constructor(private http: HttpClient) { }

  private token= localStorage.getItem('token');

  private headers = new HttpHeaders({
    Authorization: `Bearer ${this.token}`
  });

  getProductById(id: number): Observable<ProductDTO> {
    return this.http.get<ProductDTO>(`${this.apiUrl}/getById/${id}`);
  }

}
