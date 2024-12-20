import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterOutlet} from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { CartService } from '../cart/cart.service';
import { CartDTO } from '../../model/cart.model';
import { HttpErrorResponse } from '@angular/common/http';
import {HeaderComponent} from '../../layout/header/header.component';
import {FooterComponent} from '../../layout/footer/footer.component';
import {CartItemComponent} from './cart-item/cart-item.component';
import {CurrencyPipe, NgFor, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {UserDTO} from '../../model/user.model';
import {CartItemDTO} from '../../model/cart-item.model';
import {VariantAttributeDTO} from '../../model/variant-attribute.model';
import {PurchaseDTO} from '../../model/purchase.model';
import {PaymentDTO} from '../../model/payment.model';
import {CartItemService} from './cart-item/cart-item.service';
import {PurchaseItemService} from '../purchase/purchase-item/purchase-item.service';
import {PurchaseService} from '../purchase/purchase.service';
import {PaymentService} from '../../admin/admin-sidebar/payment/payment.service';
import {OrderService} from '../order/order.service';
import {UserService} from '../../admin/admin-sidebar/user/user.service';
import {OrderDTO} from '../../model/order.model';
import {PurchaseItemDTO} from '../../model/purchase-item.model';
import {ProductService} from '../../admin/admin-sidebar/product/product.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    CartItemComponent,
    NgIf, NgFor, FormsModule, CurrencyPipe,
  ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'] // Sửa styleUrl thành styleUrls
})
export class CartComponent implements OnInit {
  private token = localStorage.getItem('token');
  private loggedIn: boolean = false;
  currentUser: any = null;
  cart: CartDTO | null = null;
  cartId: number| null = null;


  user!: UserDTO;
  cartItems: CartItemDTO[] = [];
  selectedVariantAttribute: VariantAttributeDTO | null = null;
  cartItem: CartItemDTO | null = null;
  selectedItems: Set<number> = new Set();
  selectedCartItems: any[] = [];

  availableOrders: any[] = []; // Các order
  paymentMethods: PaymentDTO[] = []; // Các phương thức thanh toán
  showPurchaseForm: boolean = false;    // Hiển thị form mua hàng
  purchase: PurchaseDTO = {             // Thông tin purchase
    id: 0,
    totalPrice: 0,
    user: null,
    order: null,
    payment: null,
  };
  isPurchaseFormVisible = false;  // Flag điều khiển hiển thị form mua hàng




  newCartItem!: CartItemDTO;


  constructor(private cartItemService: CartItemService,
              private purchaseItemService: PurchaseItemService,
              private purchaseService: PurchaseService,
              private paymentService: PaymentService,
              private route: ActivatedRoute,
              private authService: AuthService,
              private orderService: OrderService,
              private userService: UserService,
              private cartService: CartService,
              private router: Router,
              private productService: ProductService
  ) {}

  ngOnInit() {
    this.checkLoginAndFetchCart(); // Gọi một phương thức hợp nhất để kiểm tra và lấy cart
    this.getCartItems();
    this.loadAvailableOrders();
    this.loadPaymentMethods();
  }
  togglePurchaseForm(): void {
    this.isPurchaseFormVisible = !this.isPurchaseFormVisible; // Chuyển đổi trạng thái form mua hàng
  }

  checkLoginAndFetchCart() {
    this.authService.isTokenValid().subscribe({
      next: (response) => {
        this.loggedIn = response.valid; // Nếu token hợp lệ, loggedIn sẽ là true
        if (this.loggedIn && response.user) {
          this.currentUser = response.user;

          // Chỉ gọi getCart khi đã có currentUser
          this.getCart();
          this.loadPaymentMethods();
        }
      },
      error: (err) => {
        alert('You are not logged in');
        console.error(err);
        this.loggedIn = false;
        this.router.navigate(['/login']);
      },
    });
  }

  getCart() {
    if (this.currentUser) {
      this.cartService.getCartById(this.currentUser.id).subscribe({
        next: (data) => {
          this.cart = data; // Gán cart dữ liệu lấy từ API
          console.log(this.cart);
          this.cartId= this.cart.id;
          this.getCartItems();
          this.loadAvailableOrders();
          return this.cart.id;
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 404) {
            alert('Cart not found');
          } else {
            console.error(error);
            alert(`Error fetching cart: ${error.message}`);
          }
        },
      });
    } else {
      console.warn('Current user is null. Cannot fetch cart.');
    }
  }



  // Fetch all cart items
  getCartItems(): void {
    if (this.cart){
      this.cartItemService.getCartItems(this.cart.id).subscribe({
        next: (data) => (this.cartItems = data, console.log("cart-item ",data)),
        error: (err) => console.error('Error fetching cart items', err),
      });
    }
  }

  loadAvailableOrders(): void {
    this.orderService.getOders(this.currentUser.id).subscribe(
      (orders: OrderDTO[]) => {
        this.availableOrders = orders;
        console.log("fdf"+this.availableOrders);
        console.log(orders);
      },
      (error) => {
        console.error('Error loading orders:', error);
      }
    );
  }

  // Lấy danh sách phương thức thanh toán
  loadPaymentMethods(): void {
    this.paymentService.getPayments().subscribe(
      (payments) => {
        this.paymentMethods = payments;
        console.log("dfds",this.paymentMethods)
      },
      (error) => {
        console.error('Error loading payment methods:', error);
      }
    );
  }

  // Create a new cart item
  createCartItem(): void {
    if (!this.selectedVariantAttribute) {
      alert('Please select an attribute!');
      return;
    }

    const newItem: CartItemDTO = {
      ...this.newCartItem,
      variantAttribute: this.selectedVariantAttribute,
    };

    this.cartItemService.createCartItem(newItem).subscribe({
      next: (data) => {
        this.cartItems.push(data);
        console.log('Cart Item Created:', data);
      },
      error: (err) => console.error('Error creating cart item', err),
    });
  }

  // Update an existing cart item
  updateCartItem(item: CartItemDTO): void {
    const updatedQuantity = prompt(
      'Enter new quantity:',
      item.quantity.toString()
    );
    const quantity = updatedQuantity ? parseInt(updatedQuantity, 10) : item.quantity;

    console.log('Quantity:', quantity);

    const updatedItem: CartItemDTO = {
      id: item.id,
      product: item.product,
      cart: item.cart,
      variantAttribute: item.variantAttribute,
      quantity: quantity,
    };

    this.cartItemService.updateCartItem(item.id, updatedItem).subscribe({
      next: (data) => {
        const index = this.cartItems.findIndex((ci) => ci.id === item.id);
        if (index !== -1) this.cartItems[index] = data;
        console.log('Cart Item Updated:', data);
      },
      error: (err) => {console.error('Error updating cart item', err)
      console.log(updatedItem)}
    });
  }

  // Delete a cart item
  deleteCartItem(itemId: number): void {

      this.cartItemService.deleteCartItem(itemId).subscribe({
        next: () => {
          this.cartItems = this.cartItems.filter((item) => item.id !== itemId);
          console.log(`Cart Item ${itemId} deleted successfully.`);
        },
        error: (err) => console.error('Error deleting cart item', err),
      });

  }

  selectVariantAttribute(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const id = parseInt(inputElement.value, 10);

    if (!isNaN(id) && this.cartItem?.variantAttribute) {
      this.selectedVariantAttribute = this.cartItem.variantAttribute;
    } else {
      console.error('Invalid attribute ID or variantAttribute is null');
    }
  }

  // Thêm cart-item vào danh sách được chọn
  toggleCartItemSelection(item: CartItemDTO): void {
    const index = this.selectedCartItems.findIndex((selectedItem) => selectedItem.id === item.id);
    if (index > -1) {
      this.selectedCartItems.splice(index, 1); // Bỏ chọn nếu đã được chọn
    } else {
      this.selectedCartItems.push(item); // Thêm nếu chưa được chọn
    }
  }

// Hiển thị form mua hàng
  showPurchaseFormAction(): void {
    if (this.selectedCartItems.length === 0) {
      alert('Vui lòng chọn ít nhất một sản phẩm!');
      return;
    }
    this.purchase.totalPrice = this.calculateTotalPrice(); // Tính tổng giá trị
    this.showPurchaseForm = true; // Hiển thị form
  }

  calculateTotalPrice(): number {
    return this.selectedCartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );


  }


// Xác nhận và gửi yêu cầu tạo purchase
  confirmPurchase(): void {
    if (!this.purchase.order || !this.purchase.payment) {
      alert('Vui lòng chọn đơn hàng và phương thức thanh toán!');
      return;
    }
    this.purchase.user=this.currentUser;
    this.purchase.totalPrice=this.calculateTotalPrice();

    // Tạo purchase
    this.purchaseService.createPurchase(this.purchase).subscribe({
      next: (purchase) => {
        console.log('Purchase created:', purchase);

        // Tạo purchase-item cho từng cart-item
        this.selectedCartItems.forEach((cartItem) => {
          const purchaseItem: PurchaseItemDTO = {
            id: 0,
            product: cartItem.product,
            quantity: cartItem.quantity,
            attribute: cartItem.variantAttribute,
            purchase: purchase,
            rated:false
          };

          this.purchaseItemService.createPurchaseItem(purchaseItem).subscribe({
            next: (data) => console.log('Purchase item created:', data),
            error: (err) => console.error('Error creating purchase item:', err),
          });
          this.deleteCartItem(cartItem.id);
          const updProduct = purchaseItem.product;
          updProduct.quantity += purchaseItem.quantity;
          this.productService.updateProduct(updProduct.id,updProduct).subscribe({
            next: (data) => {
              console.log("Product updated:", data);
            },
            error:(err)=>{
              console.log(err);
            }
          })

        });

        alert('Đặt hàng thành công!');
        this.selectedCartItems = [];
        this.showPurchaseForm = false; // Ẩn form

      },
      error: (err) => {
        console.error('Error creating purchase:', err);
        alert('Đặt hàng thất bại!');
      },
    });
  }



}
