import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ProductVariantDTO} from '../../../model/product-variant.model';
import {ProductDTO} from '../../../model/product.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductVariantService {

  private apiUrl = 'http://localhost:8088/api/v1/variant';
  constructor(private http: HttpClient) {}

  private token= localStorage.getItem('token'); // Lấy token từ localStorage

  private headers = new HttpHeaders({
    Authorization: `Bearer ${this.token}` // Gắn Bearer token
  });

  createVariant(productVariantDTO: ProductVariantDTO): Observable<ProductVariantDTO> {
    return this.http.post<ProductVariantDTO>(`${this.apiUrl}/create`, productVariantDTO, { headers: this.headers });
  }

  getVariants(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/all/${id}`);
  }

  getVariant(id: number): Observable<ProductVariantDTO> {
    return this.http.get<ProductVariantDTO>(`${this.apiUrl}/variant/${id}`);
  }

  deleteVariant(id: number): Observable<any> {
    return this.http.delete<ProductVariantDTO>(`${this.apiUrl}/delete/${id}`,{headers: this.headers});
  }


}
