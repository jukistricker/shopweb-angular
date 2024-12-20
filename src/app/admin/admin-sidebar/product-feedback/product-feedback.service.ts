import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ProductFeedbackDTO} from '../../../model/product-feedback.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductFeedbackService {

  private apiUrl = 'http://localhost:8088/api/v1/feedback';
  constructor(private http: HttpClient) {}

  private token= localStorage.getItem('token'); // Lấy token từ localStorage

  private headers = new HttpHeaders({
    Authorization: `Bearer ${this.token}` // Gắn Bearer token
  });

  createFeedback(productFeedback: ProductFeedbackDTO){
    return this.http.post<ProductFeedbackDTO>(`${this.apiUrl}/create`, productFeedback, { headers: this.headers });
  }

  getFeedbackByProductId(id:number): Observable<any>{
    return this.http.get(`${this.apiUrl}/all/${id}`);
  }

}
