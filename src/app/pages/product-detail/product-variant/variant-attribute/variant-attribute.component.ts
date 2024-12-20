import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {VariantAttributeService} from './variant-attribute.service';
import { VariantAttributeDTO } from '../../../../model/variant-attribute.model';
import { ProductVariantDTO } from '../../../../model/product-variant.model';
import { HttpErrorResponse } from '@angular/common/http';
import { NgFor, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import {FormsModule} from '@angular/forms';
import {RouterOutlet} from '@angular/router';
import {AuthService} from '../../../../feature/auth/auth.service';

@Component({
  selector: 'app-variant-attribute',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, RouterOutlet, NgFor],
  templateUrl: './variant-attribute.component.html',
  styleUrls: ['./variant-attribute.component.scss'],
})
export class VariantAttributeComponent implements OnInit {
  @Input() productVariant!: ProductVariantDTO;

  variantAttributes: VariantAttributeDTO[] = [];
  errorMessage: string | null = null;
  newAttributeName: string = ''; // Dùng để thêm thuộc tính mới

  @Output() attributeSelected = new EventEmitter<VariantAttributeDTO>();
  selectedAttribute: VariantAttributeDTO| null=null;
  currentUserId: number | null = null;
  variantAttribute: VariantAttributeDTO | null = null;

  private subscription = new Subscription();

  constructor(private attributeService: VariantAttributeService,
              private authService: AuthService,) {}

  ngOnInit(): void {
    this.loadAttributes();
    this.authService.currentUserSubject.subscribe({
      next: (user) => {
        this.currentUserId = user.id;
      },
      error: () => {
        this.currentUserId = null;
      },
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadAttributes(): void {
    this.subscription.add(
      this.attributeService.getAttributes(this.productVariant.id).subscribe({
        next: (attributes: VariantAttributeDTO[]) => {
          this.variantAttributes = attributes;
          console.log(this.variantAttributes);
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = `Failed to load attributes: ${error.message}`;
        },
      })
    );
  }

  selectAttribute(attribute: VariantAttributeDTO): void {
    this.selectedAttribute = attribute;
    console.log('Selected Attribute:', attribute);

    this.attributeSelected.emit(attribute);
  }

  addAttribute(): void {
    if (!this.newAttributeName.trim()) {
      console.log('Attribute name cannot be empty');
      return;
    }

    const newAttribute: VariantAttributeDTO = {
      id: 0, // Server sẽ tự sinh ID
      productVariant: this.productVariant,
      attName: this.newAttributeName,
    };

    this.subscription.add(
      this.attributeService.createAttribute(newAttribute).subscribe({
        next: (createdAttribute) => {
          this.variantAttributes.push(createdAttribute); // Cập nhật danh sách
          this.newAttributeName = ''; // Reset input
          console.log('Attribute added:', createdAttribute);
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = `Failed to add attribute: ${error.message}`;
        },
      })
    );
  }

  updateAttribute(attribute: VariantAttributeDTO): void {
    // Cập nhật thuộc tính variantAttribute với giá trị mới
    this.variantAttribute = {
      ...attribute,
      attName: prompt('Update Attribute Name:', attribute.attName) || attribute.attName,
    };

    // Nếu variantAttribute không phải là null, thực hiện cập nhật
    if (this.variantAttribute) {
      this.subscription.add(
        this.attributeService.updateAttribute(attribute.id, this.variantAttribute).subscribe({
          next: () => {
            const index = this.variantAttributes.findIndex((att) => att.id === attribute.id);
            if (index !== -1) {
              // Đảm bảo variantAttribute không phải là null trước khi gán
              this.variantAttributes[index] = this.variantAttribute!;
            }
            console.log('Attribute updated:', this.variantAttribute);
          },
          error: (error: HttpErrorResponse) => {
            this.errorMessage = `Failed to update attribute: ${error.message}`;
          },
        })
      );
    }
  }

  deleteAttribute(attributeId: number): void {
    if (!confirm('Are you sure you want to delete this attribute?')) {
      return;
    }

    this.subscription.add(
      this.attributeService.deleteAttribute(attributeId).subscribe({
        next: () => {
          this.variantAttributes = this.variantAttributes.filter((att) => att.id !== attributeId);
          console.log('Attribute deleted:', attributeId);
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = `Failed to delete attribute: ${error.message}`;
        },
      })
    );
  }
}
