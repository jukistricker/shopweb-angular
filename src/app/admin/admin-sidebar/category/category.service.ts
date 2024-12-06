import { Injectable } from '@angular/core';
import {map, Observable} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {CategoryDTO} from '../../../model/category.model';
import {ResponseMessageDTO} from '../../../model/ResponseMessage.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = 'http://localhost:8088/api/v1/category';



  private token= localStorage.getItem('token'); // Lấy token từ localStorage

  private headers = new HttpHeaders({
    Authorization: `Bearer ${this.token}` // Gắn Bearer token
  });

  constructor(private http: HttpClient) { }
  getAllCategories(): Observable<any> {

    return this.http.get(`${this.apiUrl}/getAll`);
  }


  createCategory(category: CategoryDTO): Observable<CategoryDTO> {


    return this.http.post<CategoryDTO>(`${this.apiUrl}/create`, category, { headers: this.headers });
  }

  updateCategory(id:number, category:CategoryDTO):Observable<any> {
    return this.http.post(`${this.apiUrl}/updateById/${id}`, category,{headers: this.headers});
  }

  getCategory(id:number):Observable<any> {
    return this.http.get(`${this.apiUrl}/getById/${id}`);
  }

  deleteCategory(id:number):Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`,{headers: this.headers});
  }

}
