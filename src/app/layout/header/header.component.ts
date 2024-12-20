import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, NgOptimizedImage } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../feature/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgOptimizedImage, NgIf, NgFor, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  loggedIn: boolean = false; // Trạng thái đăng nhập
  currentUser: any = null; // Thông tin người dùng hiện tại

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.isLoggedIn(); // Kiểm tra trạng thái khi component được tải
  }

  // Kiểm tra trạng thái đăng nhập bằng cách kiểm tra token hợp lệ
  isLoggedIn() {
    this.authService.isTokenValid().subscribe({
      next: (response) => {
        this.loggedIn = response.valid; // Nếu token hợp lệ, loggedIn sẽ là true
        if (this.loggedIn && response.user) {
          this.currentUser = response.user; // Lưu thông tin người dùng khi đăng nhập
        }
      },
      error: () => {
        this.loggedIn = false; // Nếu token không hợp lệ hoặc hết hạn, loggedIn sẽ là false
      },
    });
  }

  // Đăng xuất người dùng
  logout() {
    this.authService.logout().subscribe({
      next: () => {
        localStorage.removeItem('token'); // Xóa token khỏi localStorage
        this.loggedIn = false; // Cập nhật trạng thái đăng xuất
        this.router.navigate(['/login']); // Điều hướng về trang đăng nhập
      },
      error: (err) => console.error('Logout failed:', err),
    });
  }

  protected readonly RouterLink = RouterLink;
}
