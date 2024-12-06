import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';
import { HttpClient} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8088/api/v1/auth';
  constructor(private http: HttpClient) {

  }

  login(email: string, password: string): Observable<any> {
    const body = {email: email, password: password};
    return this.http.post(`${this.apiUrl}/token`,  body);
  }
  logout(): Observable<any> {
    const token = localStorage.getItem('token');
    if(!token){
      alert("Token not found");
    }
    return this.http.post(`${this.apiUrl}/logout`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
  isTokenValid(): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      return new Observable((observer) => {
        observer.next({ valid: false });
        observer.complete();
      });
    }

    return this.http.post(`${this.apiUrl}/introspect`, { token });
  }



}
