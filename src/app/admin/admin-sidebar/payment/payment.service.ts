import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:8088/api/v1/payment';
  constructor(private http: HttpClient) {}

  private token= localStorage.getItem('token'); // Lấy token từ localStorage

  private headers = new HttpHeaders({
    Authorization: `Bearer ${this.token}` // Gắn Bearer token
  });
  getPayments():Observable<any> {
    return this.http.get(`${this.apiUrl}/getAll`,{headers:this.headers});
  }

  getPayment(id:number){
    return this.http.get(`${this.apiUrl}/getById/${id}`,{headers:this.headers});
  }


}
