import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import {catchError, Observable} from 'rxjs';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    if (token) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(cloned).pipe(
        catchError((error) => {
          // Nếu token không hợp lệ hoặc hết hạn, chuyển hướng đến trang đăng nhập
          if (error.status === 401) {
            this.router.navigate(['/login']);
          }
          throw error;
        })
      );
    }
    this.router.navigate(['/login']);
    return next.handle(req);
  }
}
