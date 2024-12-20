import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {VariantAttributeDTO} from '../../model/variant-attribute.model';
import {OrderDTO} from '../../model/order.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = 'http://localhost:8088/api/v1/order';
  constructor(private http: HttpClient) { }

  private token= localStorage.getItem('token');

  private headers = new HttpHeaders({
    Authorization: `Bearer ${this.token}`
  });

  createOrder(orderDto: OrderDTO): Observable<OrderDTO> {
    return this.http.post<OrderDTO>(`${this.apiUrl}/create`, orderDto, {headers: this.headers});
  }

  getOders(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/all/${id}`, {headers: this.headers});
  }

  getOrder(id: number): Observable<OrderDTO> {
    return this.http.get<OrderDTO>(`${this.apiUrl}/getById/${id}`, {headers: this.headers});
  }

  updateOrder(id: number, orderDto: OrderDTO): Observable<OrderDTO> {
    return  this.http.post<OrderDTO>(`${this.apiUrl}/update/${id}`,orderDto, {headers: this.headers});
  }

  deleteOrder(id: number): Observable<any> {
    return this.http.delete<OrderDTO>(`${this.apiUrl}/delete/${id}`, {headers: this.headers});
  }


}
