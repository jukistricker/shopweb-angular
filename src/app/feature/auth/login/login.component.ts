import {HeaderComponent} from '../../../layout/header/header.component';
import {FooterComponent} from '../../../layout/footer/footer.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Observable, Subscription} from 'rxjs';
import {NgFor, NgIf} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../auth.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, NgIf, NgFor, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {


  email: string = '';
  password: string = '';
  private subscription: Subscription = new Subscription();
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  login(email: string, password: string) {
    if (this.email&&this.password){
      this.subscription.add(
        this.authService.login(email, password).subscribe({
          next: (response) => {
            // Lưu token khi đăng nhập thành công
            localStorage.setItem('token', response.data.token);  // Giả sử token đến từ response


            const token = localStorage.getItem('token');

            alert("Login Success");
            if (token) {
              console.log('Token saved:', token);
            } else {
              console.error('Token saving failed!');
            }

            this.router.navigate(['/']);

          },
          error: error => {
            console.error('Login error:', error);
            this.errorMessage = 'Email or password is incorrect';
          }
        })

      )
    }
    else {
      this.errorMessage = 'Please fill out both fields.';
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe(); // Hủy các subscription khi component bị hủy
  }

}
