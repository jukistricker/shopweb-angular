import { Component, OnInit } from '@angular/core';
import {RegisterService} from './register.service';
import { UserDTO } from '../../model/user.model';
import {Router, RouterLink} from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import {HeaderComponent} from '../../layout/header/header.component';
import {FooterComponent} from '../../layout/footer/footer.component';
import {NgIf} from '@angular/common';
import {UserService} from '../../admin/admin-sidebar/user/user.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [HeaderComponent, FooterComponent, RouterLink, NgIf,FormsModule],

  standalone: true
})
export class RegisterComponent implements OnInit {

  user: UserDTO = {id:0, username:'',fullname:'', email: '', password: '' , role:'user',isEditing:false,isUpdating:false}; // Tạo đối tượng UserDTO
  termsAccepted: boolean = false; // Kiểm tra trạng thái checkbox
  errorMessage: string = '';
  isSubmitting: boolean = false;

  constructor(private registerService: RegisterService, private router: Router,
              private userService: UserService,) { }

  ngOnInit(): void {}

  // Xử lý đăng ký người dùng
  register(): void {
    if (!this.termsAccepted) {
      this.errorMessage = 'Bạn cần chấp nhận điều khoản sử dụng.';
      return;
    }

    this.isSubmitting = true;
    this.registerService.register(this.user).subscribe({
      next: (data) => {
        // Sau khi đăng ký thành công, chuyển đến trang đăng nhập
        this.router.navigate(['/login']);
      },
      error: (err: HttpErrorResponse) => {
        this.isSubmitting = false;
        this.errorMessage = 'Đăng ký thất bại, vui lòng thử lại.';
        console.error('Registration Error: ', err);
      }
    });
  }

  // Kiểm tra và bật nút đăng ký khi checkbox được chọn
  onTermsChanged(event: Event): void {
    this.termsAccepted = (event.target as HTMLInputElement).checked;
  }
}
