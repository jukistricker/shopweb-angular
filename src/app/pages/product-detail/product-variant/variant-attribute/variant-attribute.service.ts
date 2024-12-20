import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ProductVariantDTO} from '../../../../model/product-variant.model';
import {Observable} from 'rxjs';
import {VariantAttributeDTO} from '../../../../model/variant-attribute.model';
import {create} from 'node:domain';

@Injectable({
  providedIn: 'root'
})
export class VariantAttributeService {

  private apiUrl = 'http://localhost:8088/api/v1/attribute';
  constructor(private http: HttpClient) {}

  private token= localStorage.getItem('token'); // Lấy token từ localStorage

  private headers = new HttpHeaders({
    Authorization: `Bearer ${this.token}` // Gắn Bearer token
  });

  createAttribute(variantAttributeDTO: VariantAttributeDTO): Observable<VariantAttributeDTO> {
    return this.http.post<VariantAttributeDTO>(`${this.apiUrl}/create`,variantAttributeDTO, {headers: this.headers});
  }

  getAttributes(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/all/${id}`);
  }

  getAttribute(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getById/${id}`);
  }

  updateAttribute(id: number, variantAttributeDTO: VariantAttributeDTO): Observable<any> {
    return this.http.post<VariantAttributeDTO>(`${this.apiUrl}/update/${id}`,variantAttributeDTO, {headers: this.headers});
  }

  deleteAttribute(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`,{headers: this.headers});
  }


}
