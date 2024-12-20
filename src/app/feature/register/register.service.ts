import { Injectable } from '@angular/core';
import {PurchaseDTO} from '../../model/purchase.model';
import {Observable} from 'rxjs';
import {UserDTO} from '../../model/user.model';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private apiUrl = 'http://localhost:8088/api/v1/user'

  constructor(private http: HttpClient) { }

  register(userDto: UserDTO): Observable<UserDTO> {
    return this.http.post<UserDTO>(`${this.apiUrl}/register`, userDto);
  }

}
