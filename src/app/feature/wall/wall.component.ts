import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {ActivatedRoute, RouterLink} from '@angular/router'; // Để lấy id từ URL
import { AuthService } from '../auth/auth.service';
import { UserService } from '../../admin/admin-sidebar/user/user.service';
import { UserDTO } from '../../model/user.model';
import { HeaderComponent } from '../../layout/header/header.component';
import { FooterComponent } from '../../layout/footer/footer.component';
import {CurrencyPipe, NgFor, NgIf, NgOptimizedImage} from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Router} from '@angular/router';
import {WallService} from './wall.service';
import {ProductDTO} from '../../model/product.model';
import {CategoryService} from '../../admin/admin-sidebar/category/category.service';
import {ProductService} from '../../admin/admin-sidebar/product/product.service';

@Component({
  selector: 'app-wall',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, NgFor, NgIf, FormsModule, RouterLink, NgOptimizedImage, CurrencyPipe],
  templateUrl: './wall.component.html',
  styleUrls: ['./wall.component.scss'],
})
export class WallComponent implements OnInit {
  currentUser: any; // To store the current user
  user: UserDTO | null = null; // To store the user data fetched from the API

  userIdFromRoute: number | null = null; // Store the user id from the route
  private loggedIn: boolean = false;

  products: ProductDTO[] = [];

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private wallService: WallService,
    private categoryService: CategoryService,
    private productService: ProductService,
  ) {}

  ngOnInit() {
    this.isLoggedIn();

    this.authService.currentUserSubject.subscribe({
      next: (user) => {
        this.currentUser = user;
        if (this.currentUser && this.currentUser.id) {
          this.route.paramMap.subscribe({
            next: (params) => {
              this.userIdFromRoute = +params.get('id')!;
              this.loadUser(this.userIdFromRoute!)


            },
            error: (err) => {
              console.error('Error fetching route params:', err);
              this.router.navigate(['/login']);
            }
          });
        }
      },
      error: (err) => {
        alert('error fetching route params'+err);
        console.error('Error fetching user data:', err);
        this.router.navigate(['/login']);
      }
    });

    this.fetchCategories();





  }

  categories: any[] = [];
  isAddProductFormVisible: boolean = false;
  newProduct: any = {
    user: null,
    productName: '',
    category: { id: null },
    description: '',
    price: null,
    quantity: null,
    sale: false,
    salePrice: null,
    saleEndDate: ''
  };

  fetchCategories(): void {
    this.categoryService.getAllCategories().subscribe(
      (data) => {
        this.categories = data;
        console.log('Categories:', this.categories);
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  isLoggedIn() {
    this.authService.isTokenValid().subscribe({
      next: (response) => {
        this.loggedIn = response.valid; // Nếu token hợp lệ, loggedIn sẽ là true
        if (this.loggedIn && response.user) {
          this.currentUser = response.user;
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

  loadUser(userId: number): void {

    this.userService.getUserById(userId).subscribe({
      next: (data: UserDTO) => {
        this.user = data;
        console.log(data)
        this.loadProducts(data.id);
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 404) {
          alert('User not found');
        } else {
          console.error('Error fetching user data', error);
          alert(`Error fetching user data: ${error.message}`);
          this.router.navigate(['/login']);
        }
      },
    });
  }

  editUser(user: UserDTO): void {
    this.user = { ...user, isEditing: true };
  }

  updateUser(): void {
    if (this.user) {

      this.userService.updateUser(this.user.id, this.user).subscribe({
        next: (data) => {
          alert('User updated successfully');
          this.loadUser(this.currentUser.id);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error updating user data', error);
          alert('Failed to update user\n' + error);
        },
      });
    }
  }

  becomeSeller(): void {
    if (this.user) {

      const updatedUser = { ...this.user };
      updatedUser.role="seller";
      this.userService.updateUser(this.user.id, updatedUser).subscribe({
        next: () => {
          alert('You are now a seller!');
          this.loadUser(this.currentUser.id); // Reload user data
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error becoming a seller:', error);
          alert('Failed to update role to seller\n' + error.message);
        },
      });
    }
  }

  cancelSeller(): void {
    if (this.user) {

      const updatedUser = { ...this.user };
      updatedUser.role="user";
      this.userService.updateUser(this.user.id, updatedUser).subscribe({
        next: () => {
          alert('You are no longer a seller.');
          this.loadUser(this.currentUser.id); // Reload user data
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error cancelling seller role:', error);
          alert('Failed to update role to user\n' + error.message);
        },
      });
    }
  }

  loadProducts(userId: number): void {
    this.wallService.getProductByUserId(userId).subscribe({
      next: (data) => {
        this.products = data; // Store the products
        console.log('Fetched products:', this.products);
      },
      error: (error) => {
        console.error('Error fetching products:', error);
        alert('Failed to load products for this user');
      }
    });
  }

  toggleAddProductForm(): void {
    this.isAddProductFormVisible = !this.isAddProductFormVisible;
  }

  cancelAddProduct(): void {
    this.isAddProductFormVisible = false;
  }

  createProduct(): void {
    if (!this.newProduct.user){
      this.newProduct.user = this.currentUser;
    }

    this.productService.createProduct(this.newProduct).subscribe((product) => {
      alert('Product added successfully');
      this.products.push(product);  // Thêm sản phẩm mới vào danh sách sản phẩm
      this.cancelAddProduct();  // Đóng form
    }, (error) => {
      alert('Failed to add product');
    });
  }


}
