import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {ProductDTO} from '../../../model/product.model';
import {resolveSoa} from 'node:dns'; // Ensure this matches your DTO model

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  private apiUrl = 'http://localhost:8088/api/v1/product';
  constructor(private http: HttpClient) {}

  private token= localStorage.getItem('token'); // Lấy token từ localStorage

  private headers = new HttpHeaders({
    Authorization: `Bearer ${this.token}` // Gắn Bearer token
  });

  // Create Product
  createProduct(product: ProductDTO): Observable<ProductDTO> {
    return this.http.post<ProductDTO>(`${this.apiUrl}/create`, product, { headers: this.headers });
  }

  // Get All Products
  getAllProducts(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getAll`);
  }

  // Get Product by ID
  getProductById(id: number): Observable<ProductDTO> {
    return this.http.get<ProductDTO>(`${this.apiUrl}/getById/${id}`);
  }

  getProductByCate(id:number):Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/cate/${id}`);
  }


  // Update Product by ID
  updateProduct(id: number, product: ProductDTO): Observable<ProductDTO> {
    return this.http.post<ProductDTO>(`${this.apiUrl}/updateById/${id}`, product, { headers: this.headers });
  }

  // Delete Product by ID
  deleteProduct(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/deleteById/${id}`, { headers: this.headers });
  }
}
