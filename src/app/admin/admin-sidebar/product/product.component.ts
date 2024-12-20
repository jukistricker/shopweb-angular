import {Component, OnDestroy, OnInit} from '@angular/core';
import { ProductService } from './product.service';
import {ProductDTO} from '../../../model/product.model';
import {CurrencyPipe, NgFor, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';
import {UserDTO} from '../../../model/user.model';
import {UserService} from '../user/user.service';
import {CategoryDTO} from '../../../model/category.model';
import {CategoryService} from '../category/category.service';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, CurrencyPipe],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();

  products: ProductDTO[] = [];
  users: UserDTO[]=[];
  categories: CategoryDTO[]=[];


  constructor(private userService: UserService,
              private productService: ProductService,
              private router: Router,
              private categoryService: CategoryService,) {}
  ngOnInit(): void {
    this.loadUsers();
    this.fetchCategories();
    this.loadProducts();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (error) => {
        console.error('Error fetching user data', error);
        alert('Failed to load user data');
      }
    });
  }

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

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data.data;  // Assuming the response contains a data property
      },
      error: (error) => {
        console.error('Error fetching product data', error);
        alert('Failed to load product data');
      },
    });
  }



  addProduct(): void {
    const {isEditing: isEditingUser, isUpdating:isUpdatingUser , ...huce }= this.users[0];
    const {isEditing: isEditingCategory, isUpdating:isUpdatingCategory , ...categoryy }= this.categories[0];


    this.products.push({
      id: 0,
      user: huce,
      productName: '',
      category: categoryy,
      description: '',
      featuredImageUrl: '',
      price: 0,
      quantity: 0,
      ProductState: '',
      purchaseCount: 0,
      rating: 0,
      sale: false,
      saleEndDate: '',
      salePrice: 0,
      isEditing: true,
      isUpdating: false
    });
  }

  createProduct(index: number) {
    const product = this.products[index];

    if (!product.productName.trim()) {
      alert("Product name is required");
      return;
    }

    this.subscription.add(
      this.productService.createProduct(product).subscribe({
        next: (response) => {
          this.products[index] = response;
          this.products[index].isEditing = false;
        },
        error: (error) => {
          console.error("Error creating product", error);
        },
      })
    );
  }

  updateProduct(index: number) {
    this.products[index].isEditing = true;
    this.products[index].isUpdating = true;
  }

  saveProduct(index: number) {
    const product = this.products[index];

    if (!product.productName.trim()) {
      alert("Product name is required");
      return;
    }

    this.subscription.add(
      this.productService.updateProduct(product.id, product).subscribe({
        next: (response) => {
          this.products[index] = response;
          this.products[index].isEditing = false;
          this.products[index].isUpdating = false;
        },
        error: (error) => {
          console.error("Error updating product", error);
        },
      })
    );
  }

  deleteProduct(index: number) {
    const productId = this.products[index].id;

    this.subscription.add(
      this.productService.deleteProduct(productId).subscribe({
        next: () => {
          this.products.splice(index, 1);
        },
        error: (error) => {
          console.error("Error deleting product", error);
        },
      })
    );
  }





  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  protected readonly indexedDB = indexedDB;
}
