import {Component, OnInit} from '@angular/core';
import {NgFor, NgIf, NgOptimizedImage} from '@angular/common';
import {Router} from '@angular/router';
import {AuthService} from '../../feature/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgOptimizedImage, NgIf, NgFor
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  loggedIn: boolean = false; // Trạng thái đăng nhập

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isLoggedIn(); // Kiểm tra trạng thái khi component được tải
  }

  isLoggedIn() {
    this.authService.isTokenValid().subscribe({
      next: (response) => {
        this.loggedIn = response.valid; // Nếu token hợp lệ, loggedIn sẽ là true
      },
      error: () => {
        this.loggedIn = false; // Nếu token không hợp lệ hoặc hết hạn, loggedIn sẽ là false
      },
    });
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        localStorage.removeItem('token'); // Xóa token khỏi localStorage
        this.loggedIn = false; // Cập nhật trạng thái đăng xuất
      },
      error: (err) => console.error('Logout failed:', err),
    });
  }


}
