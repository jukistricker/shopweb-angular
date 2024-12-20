import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, of, tap} from 'rxjs';
import { HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public currentUserSubject = new BehaviorSubject<any>(null);
  private apiUrl = 'http://localhost:8088/api/v1/auth';
  constructor(private http: HttpClient,
              private router: Router) {

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
        this.router.navigate(['/login'])
      });
    }

    return this.http.post(`${this.apiUrl}/introspect`, { token }).pipe(
      tap((response: any) => {
        if (response.valid && response.user) {
          // Save user info if token is valid
          this.currentUserSubject.next(response.user);
          console.log(response.user);
        }
        else {
          console.error(response.error);
          alert(response.error);
          this.router.navigate(['/login']);
        }
      })
    );
  }



}
