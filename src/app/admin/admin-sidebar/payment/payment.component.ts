import {Component, OnInit} from '@angular/core';
import {PaymentService} from './payment.service';
import {NgFor, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [NgFor,NgIf,FormsModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent implements OnInit {
  payments: any[] = []; // Danh sách thanh toán
  selectedPayment: any; // Chi tiết thanh toán được chọn
  errorMessage: string | null = null; // Xử lý lỗi

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.loadPayments(); // Lấy danh sách thanh toán khi khởi tạo
  }

  // Lấy tất cả thanh toán
  loadPayments(): void {
    this.paymentService.getPayments().subscribe({
      next: (data) => {
        this.payments = data;
        console.log('Payments:', this.payments);
      },
      error: (error) => {
        this.errorMessage = 'Failed to load payments.';
        console.error(error);
      }
    });
  }

  // Lấy chi tiết thanh toán theo ID
  loadPaymentDetails(id: number): void {
    this.paymentService.getPayment(id).subscribe({
      next: (data) => {
        this.selectedPayment = data;
        console.log('Selected Payment:', this.selectedPayment);
      },
      error: (error) => {
        this.errorMessage = 'Failed to load payment details.';
        console.error(error);
      }
    });
  }
}
