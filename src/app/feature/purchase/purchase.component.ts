import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router, RouterOutlet} from '@angular/router';
import {PurchaseService} from './purchase.service';
import { PurchaseDTO } from '../../model/purchase.model';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {FormsModule, NgForm} from '@angular/forms';
import {HeaderComponent} from '../../layout/header/header.component';
import {FooterComponent} from '../../layout/footer/footer.component';
import {CurrencyPipe, NgClass, NgFor, NgIf} from '@angular/common';
import {PurchaseItemComponent} from './purchase-item/purchase-item.component';
import {UserService} from '../../admin/admin-sidebar/user/user.service';
import {AuthService} from '../auth/auth.service';
import {PurchaseItemService} from './purchase-item/purchase-item.service';
import {ProductFeedbackService} from '../../admin/admin-sidebar/product-feedback/product-feedback.service';
import {PurchaseItemDTO} from '../../model/purchase-item.model';
import {ProductFeedbackDTO} from '../../model/product-feedback.model';


@Component({
  selector: 'app-purchase',
  imports: [NgFor, NgIf, FormsModule, HeaderComponent, FooterComponent, PurchaseItemComponent, RouterOutlet, CurrencyPipe, NgClass],
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss'],
  standalone:true
})
export class PurchaseComponent implements OnInit {

  purchase: PurchaseDTO | null = null;
  loading: boolean = true;
  errorMessage: string = '';
  currentUser:any;
  loggedIn: boolean = false;
  purchases: PurchaseDTO[] = [];
  purchaseid!:number;
  purchaseItems: PurchaseDTO[] = [];
  purchaseItemsMap: Map<number, any[]> = new Map(); // Key là purchaseId, value là danh sách purchase-items





  stars = [1, 2, 3, 4, 5]; // 5 ngôi sao
  rating = {
    rate: 0, // Số lượng ngôi sao được chọn
    pFeedback: '', // Nội dung feedback
  };
  isRatingFormVisible = false; // Kiểm soát form hiển thị
  selectedPurchaseItem: any;

  constructor(private purchaseService: PurchaseService, private route: ActivatedRoute,
              private userService: UserService,
              private authService: AuthService,
              private router: Router,
              private purchaseItemService: PurchaseItemService,
              private productFeedbackService: ProductFeedbackService) { }

  ngOnInit(): void {
    this.isLoggedIn();


  }
  isLoggedIn() {
    this.authService.isTokenValid().subscribe({
      next: (response) => {
        this.loggedIn = response.valid; // Nếu token hợp lệ, loggedIn sẽ là true
        if (this.loggedIn && response.user) {
          this.currentUser = response.user;
          this.getPurchases()
        }
      },
      error: (err) => {

        alert('You are not logged in');
        console.log(err);
        this.loggedIn = false;
        this.router.navigate(['/login']);
      },
    });
  }

  getPurchases(){
    this.purchaseService.getPurchasesByUser(this.currentUser.id).subscribe({
      next: (response) => {
        this.purchases = response;
        console.log(this.purchases);
        this.loading=false
        this.purchases.forEach((purchase) => {
          this.loadPurchaseItemsByPurchase(purchase.id);
        });
      },
      error: (err) => {
        console.log(err);
        alert(err);
      }
    })
  }


  getPurchase(){
    const purchaseId = Number(this.route.snapshot.paramMap.get('id'));

    if (purchaseId) {
      // Lấy thông tin purchase từ API
      this.purchaseService.getPurchase(purchaseId).subscribe({
        next: (data: PurchaseDTO) => {
          this.purchase = data;
          this.loading = false;
          data.id=this.purchaseid;
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error fetching purchase:', err);
          this.errorMessage = 'Không thể tải thông tin đơn mua. Vui lòng thử lại.';
          this.loading = false;
        }
      });
    } else {
      this.errorMessage = 'ID đơn mua không hợp lệ.';
      this.loading = false;
    }
  }

  loadPurchaseItemsByPurchase(purchaseId: number): void {
    this.purchaseItemService.getPurchaseItemsByPurchase(purchaseId).subscribe({
      next: (data) => {
        // Lưu purchase-items vào Map
        this.purchaseItemsMap.set(purchaseId, data);
        console.log(`Fetched items for purchase ${purchaseId}:`, data);
      },
      error: (err) => {
        console.error(`Failed to load purchase items for purchase ${purchaseId}:`, err);
      },
    });
  }

  setRating(rate: number) {
    this.rating.rate = rate; // Gán số sao được chọn
  }

  showRatingForm(purchaseItem: any) {
    this.selectedPurchaseItem = purchaseItem;
    this.isRatingFormVisible = true;
    this.rating = { rate: 0, pFeedback: '' }; // Reset rating mỗi lần mở form
  }

  submitRating() {
    if (this.rating.rate === 0) {
      alert('Please select a rating before submitting.');
      return;
    }

    const feedback: ProductFeedbackDTO = {
      id:0,
      purchaseItem: this.selectedPurchaseItem,
      user: this.currentUser,
      rate: this.rating.rate,
      feedback: this.rating.pFeedback,
    };


    this.productFeedbackService.createFeedback(feedback).subscribe({
      next: (response) => {
        alert('Thank you for your feedback!');
        console.log(response);
        this.selectedPurchaseItem.rated = true;
        this.isRatingFormVisible = false;
        console.log(this.selectedPurchaseItem);
        this.purchaseItemService.updatePurchaseItem(this.selectedPurchaseItem.id,this.selectedPurchaseItem).subscribe({
          next(response ) {
            console.log(response);
          },
          error(err){
            console.error('Error updating rating', err);
            alert(err);
          }
        })
      },
      error: (err) => {
        console.error('Error submitting feedback:', err);
        alert('Failed to submit feedback. Please try again.');
      },
    });
  }

  cancelRating() {
    this.isRatingFormVisible = false;
  }

}
