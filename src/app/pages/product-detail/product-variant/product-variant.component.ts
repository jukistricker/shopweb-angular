import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import { ProductDTO } from '../../../model/product.model';
import { ProductVariantService} from './product-variant.service';
import { ProductVariantDTO } from '../../../model/product-variant.model';
import { HttpErrorResponse } from '@angular/common/http';
import {NgFor, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Subscription} from 'rxjs';
import {AuthService} from '../../../feature/auth/auth.service';
import {VariantAttributeComponent} from './variant-attribute/variant-attribute.component';
import {RouterOutlet} from '@angular/router';
import {VariantAttributeDTO} from '../../../model/variant-attribute.model';

@Component({
  selector: 'app-product-variant',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, VariantAttributeComponent, RouterOutlet],
  templateUrl: './product-variant.component.html',
  styleUrls: ['./product-variant.component.scss'], // Sửa `styleUrl` thành `styleUrls`
})
export class ProductVariantComponent implements OnInit, OnChanges {

  private subscription:Subscription= new Subscription();

  @Input() product!: ProductDTO; // Nhận thông tin sản phẩm từ lớp cha
  productVariants: ProductVariantDTO[] = []; // Danh sách biến thể sản phẩm
  errorMessage: string = '';
  productVariant: ProductVariantDTO | null = null;

  @Output() attributeSelected = new EventEmitter<VariantAttributeDTO>();
  selectedAttribute: VariantAttributeDTO | null = null;

  currentUserId: number | null = null; // ID người dùng hiện tại, nếu có


  constructor(
    private productVariantService: ProductVariantService,
    private authService: AuthService // Inject AuthService để lấy thông tin người dùng
  ) {}



  ngOnInit() {
    this.fetchProductVariants(this.product.id);
    this.authService.currentUserSubject.subscribe({
      next: (user) => {
        this.currentUserId = user.id;
      },
      error: () => {
        this.currentUserId = null;
      },
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['productVariants.length']) {
      this.fetchProductVariants(this.product.id);
    }
  }

  onAttributeSelected(attribute: VariantAttributeDTO): void {
    this.selectedAttribute = attribute;
    console.log('Selected Attribute in Product Variant:', this.selectedAttribute);
    this.attributeSelected.emit(attribute);
  }

  // Gọi API để lấy danh sách biến thể sản phẩm theo `product.id`
  fetchProductVariants(productId: number): void {
    this.productVariantService.getVariants(productId).subscribe({
      next: (variants: ProductVariantDTO[]) => {
        this.productVariants = variants;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = `Error fetching product variants: ${error.message}`;
        console.error(error);
      },
    });
  }

  addVariant() {
    if (!this.product || !this.product.id) {
      alert('Invalid product. Cannot add variant.');
      return;
    }

    this.productVariant = {
      id: 0,
      product: this.product,
    };

    this.subscription.add(
      this.productVariantService.createVariant(this.productVariant).subscribe({
        next: (response) => {
          if (!this.productVariants) {
            this.productVariants = [];
          }
          this.productVariants.push(response);
          this.productVariant = null; // Reset lại biến
          this.fetchProductVariants(this.product.id);
          alert('Variant added successfully!');
        },
        error: (error: HttpErrorResponse) => {
          alert('Error adding variant: ' + error.message);
          console.error(error);
        },
      })
    );
  }




  // Xóa biến thể sản phẩm
  deleteVariant(variantId: number): void {
    if (confirm('Are you sure you want to delete this variant?')) {
      this.productVariantService.deleteVariant(variantId).subscribe({
        next: () => {
          // Sau khi xóa thành công, cập nhật danh sách
          this.productVariants = this.productVariants.filter(v => v.id !== variantId);
          alert('Variant deleted successfully');
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = `Error deleting variant: ${error.message}`;
          console.error(error);
        },
      });
    }
  }


}
