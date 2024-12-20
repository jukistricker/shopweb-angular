import { Component, OnInit } from '@angular/core';
import {HeaderComponent} from '../../layout/header/header.component';
import {FooterComponent} from '../../layout/footer/footer.component';
import {CurrencyPipe, NgFor, NgIf, NgOptimizedImage} from '@angular/common';
import {ProductComponent} from '../../admin/admin-sidebar/product/product.component';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {Subscription} from 'rxjs';
import {ProductService} from '../../admin/admin-sidebar/product/product.service';
import {ProductDTO} from '../../model/product.model';
import {CategoryDTO} from '../../model/category.model';
import {CategoryService} from '../../admin/admin-sidebar/category/category.service';
import {SupportComponent} from './support/support.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SupportComponent, HeaderComponent, FooterComponent, NgOptimizedImage, NgIf, NgFor, CurrencyPipe, RouterLink, RouterOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
  private subscription: Subscription = new Subscription();

  products: ProductDTO[] = [];
  categories: CategoryDTO[] = [];

  constructor(private productService: ProductService,
              private router: Router,
              private categoryService: CategoryService,) {
  }

  ngOnInit(): void {
    this.fetchCategories();
    this.loadProducts();
  }

  onCategoryChange(event: Event): void {
    const selectedCategoryId = (event.target as HTMLSelectElement).value; // Lấy giá trị đã chọn
    if (selectedCategoryId) {
      this.searchByCate(Number(selectedCategoryId)); // Gọi hàm searchByCate
    }
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
        console.log(data);
      },
      error: (error) => {
        console.error('Error fetching product data', error);
        alert('Failed to load product data');
      },
    });
  }

  searchByCate(id: number): void {
    if (!id) {
      console.log("null");
      return;

    }

    this.productService.getProductByCate(id).subscribe({
      next: (data) => {
        this.products = data; // Lưu kết quả sản phẩm theo danh mục
        console.log("Products by category:", data);
      },
      error: (error) => {
        console.error("Error fetching product data", error);
        alert("Failed to load product data");
      }
    });
  }



}
