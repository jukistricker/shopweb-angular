import { Component, OnInit, OnDestroy } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Subscription} from 'rxjs';
import {NgFor, NgIf} from '@angular/common';
import {Router} from 'express';
import {AuthService} from './auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent implements OnInit{

  isLoggedIn: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit() {
    this.checkLoginStatus();
  }
  checkLoginStatus() {
    this.authService.isTokenValid().subscribe((response) => {
      this.isLoggedIn = response.valid;
    });
  }

  logout() {
    this.authService.logout().subscribe(() => {
      localStorage.removeItem('token');
      this.isLoggedIn = false;
    });
  }
}
