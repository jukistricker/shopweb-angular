import {Component, OnDestroy, OnInit} from '@angular/core';
import {OrderService} from './order.service';
import { OrderDTO } from '../../model/order.model';
import { HeaderComponent } from "../../layout/header/header.component";
import { FooterComponent } from "../../layout/footer/footer.component";
import {AuthService} from '../auth/auth.service';
import {UserService} from '../../admin/admin-sidebar/user/user.service';
import {UserDTO} from '../../model/user.model';
import {Router} from '@angular/router';
import {NgFor, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, NgFor,NgIf,FormsModule],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit, OnDestroy {

  orderToCreate!: OrderDTO;
  loggedIn: boolean = false;
  currentUser!: UserDTO;
  orders: OrderDTO[] = [];
  userId: number|null = null;
  user: UserDTO | null = null; // To store the user data fetched from the API
  isLoading = false;
  isEditing=false;

  userIdFromRoute: number | null = null; // Store the user id from the route



  orderDetails: OrderDTO | null = null; // Chi tiết đơn hàng hiện tại (để hiển thị)
  private subscription= new Subscription();
  constructor(private orderService: OrderService,
              private authService: AuthService,
              private userService: UserService,
              private router: Router) {}

  ngOnInit(): void {
    this.isLoggedIn();
    this.authService.currentUserSubject.subscribe({
      next: (user) => {
          this.currentUser = user;
          console.log("User ID:", this.currentUser.id);
          this.loadOrders();
      },
      error: (err) => {
        alert('Error fetching user data: ' + err);
        console.error('Error fetching user data:', err);
        this.router.navigate(['/login']);
      },
    });

  }

  isLoggedIn() {
    this.authService.isTokenValid().subscribe({
      next: (response) => {
        this.loggedIn = response.valid; // Nếu token hợp lệ, loggedIn sẽ là true
        if (this.loggedIn && response.user) {
          this.currentUser = response.user;
          console.log(this.currentUser);

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

  // Lấy tất cả các đơn hàng của người dùng
  loadOrders(): void {
    this.isLoading = true;
    console.log(this.isLoading);


    console.log("currentUserID "+this.currentUser.id);
    this.orderService.getOders(this.currentUser.id).subscribe({
      next: (orders) => {
        this.orders = [];
        this.orders = orders;
        console.log('Loaded orders:', this.orders);
        this.isLoading=false;
        console.log("after load:"+this.isLoading);
      },
      error: (error) => {
        console.error('Error loading orders:', error);
      },
    });

  }



  // Tạo đơn hàng mới
  createOrder(): void {
    this.isEditing=true;
    // Reset orderToCreate khi người dùng tạo đơn hàng mới
    this.orders.push({
      id: 0,
      user: this.currentUser,
      name: '',
      phone: '',
      address: '',
      isUpdating:true,
      isEditing:true
    });
  }

  saveOrder(index: number): void {
    const oder = this.orders[index];

    if (!oder.name.trim()){
      alert('name is required');
    }
    if (!oder.phone.trim()){
      alert('phone is required');
    }
    if (!oder.address.trim()){
      alert('address is required');
    }
    this.subscription.add(
      this.orderService.createOrder(oder).subscribe({
        next: (response) => {
          this.orders[index] = response;
          this.isEditing=false;
          this.orders[index].isEditing=false;
          this.orders[index].isUpdating=false;
        },error: (err) => {
          console.error('Error creating order:', err);
          alert('There was an error creating the order.');
          this.orders[index].isEditing=false;
          this.orders[index].isUpdating = false; // Hủy bỏ trạng thái đang cập nhật
        }

      })
    )

  }
  cancelEdit(): void {
    this.isEditing = false;

  }


  // Lấy chi tiết một đơn hàng
  viewOrderDetails(orderId: number): void {
    this.orderService.getOrder(orderId).subscribe(
      (order: OrderDTO) => {
        this.orderDetails = order;
        console.log(this.orderDetails)
      },
      (error) => {
        console.error('Error loading order details:', error);
      }
    );
  }

  // Cập nhật đơn hàng
  updateOrder(orderId: number, orderDto: OrderDTO): void {
    this.orderService.updateOrder(orderId, orderDto).subscribe(
      (updatedOrder: OrderDTO) => {
        console.log('Order updated successfully:', updatedOrder);
        this.loadOrders(); // Lấy lại danh sách đơn hàng sau khi cập nhật
      },
      (error) => {
        console.error('Error updating order:', error);
      }
    );
  }

  // Xóa đơn hàng
  deleteOrder(orderId: number): void {
    this.orderService.deleteOrder(orderId).subscribe(
      () => {
        console.log('Order deleted successfully');
        this.loadOrders(); // Lấy lại danh sách đơn hàng sau khi xóa
      },
      (error) => {
        console.error('Error deleting order:', error);
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
