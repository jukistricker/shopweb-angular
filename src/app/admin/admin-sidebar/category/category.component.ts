import { Component, OnInit,OnDestroy } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Subscription} from 'rxjs';
import {NgFor, NgIf} from '@angular/common';
import {CategoryService} from './category.service';
import {CategoryDTO} from '../../../model/category.model';
import {Router} from 'express';
import {HttpHeaders} from '@angular/common/http';



@Component({
  selector: 'app-category',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent implements OnInit,OnDestroy {

  category: CategoryDTO = {
    id: 0,
    cate_name: '',
    description: '',
    isEditing: false,
    isUpdating: false
  };

  categories: CategoryDTO[]=[];

  private subscription: Subscription = new Subscription();

  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    this.fetchCategories();
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

  addCategory() {
    if (this.category.cate_name.trim() === '') {
      alert('Please fill in category name');
      return;
    }
    this.subscription.add(
      this.categoryService.createCategory(this.category).subscribe({
        next: (response) => {
          alert('Category added successfully.');
          console.log('Category added successfully',response);
          this.categories.push(response);


          this.category = { id: 0, cate_name: '', description: '' };
        },
        error: (error) => {
          console.error('Error creating category', error);
          alert('Error creating category');
        }
      })
    );
  }

  onEditCategory(category: CategoryDTO): void {
    this.category = { ...category, isEditing: true };
  }

  onUpdateCategory(): void {
    if (this.category.isEditing) {
      this.category.isUpdating = true;
      this.categoryService.updateCategory(this.category.id, this.category).subscribe(
        updatedCategory => {
          this.category = { ...updatedCategory, isEditing: false, isUpdating: false };
          alert('Category updated successfully!');
          this.fetchCategories();
        },
        error => {
          console.error('Error updating category', error);
          alert('Failed to update category');
          this.category.isUpdating = false;
        }
      );
    }
  }
  deleteCategory(id: number): void {
    this.categoryService.deleteCategory(id).subscribe({
      next: (response) => {
        console.log('Category deleted successfully', response);
        // Loại bỏ category khỏi mảng categories sau khi xóa thành công
        this.categories = this.categories.filter(category => category.id !== id);
        alert('Category deleted successfully');
      },
      error: (error) => {
        console.error('Error deleting category', error);
        alert('Error deleting category');
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  protected readonly NgIf = NgIf;
}
