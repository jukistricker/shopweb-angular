import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserDTO} from '../../../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8088/api/v1/user'; // Thay đổi URL theo đúng API của bạn

  private token= localStorage.getItem('token'); // Lấy token từ localStorage

  private headers = new HttpHeaders({
    Authorization: `Bearer ${this.token}` // Gắn Bearer token
  });

  constructor(private http: HttpClient) {}



  getUserById(id: number): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.apiUrl}/getById/${id}`);
  }


  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getAll`, {headers: this.headers});
  }

  updateUser(id:number, user: UserDTO) {
    return this.http.post(`${this.apiUrl}/updateById/${id}`, user, {headers: this.headers});
  }

  deleteUser(id:number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteById/${id}`, {headers: this.headers});
  }
}
