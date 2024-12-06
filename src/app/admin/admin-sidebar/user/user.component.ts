
import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserDTO} from '../../../model/user.model';
import {UserService} from './user.service';
import {Subscription} from 'rxjs';
import {NgFor, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ifError} from 'node:assert';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})


export class UserComponent implements OnInit, OnDestroy {

  selectedUser: UserDTO | null = null;

user: UserDTO ={
    id: 0,
    username: '',
    fullname: '',
    email: '',
    password: '',
    role: "user",

    isEditing:false,
    isUpdating:false
  };
  userId: number | undefined;

  users: UserDTO[]=[];

  private subscription: Subscription= new Subscription();

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
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



  loadUser(): void {
    if (this.userId == null || this.userId === 0) {
      alert('Please enter a valid User ID');
      return;
    }

    this.userService.getUserById(this.userId).subscribe({
      next: (data) => {
        this.user = data;

      },
      error: (error: HttpErrorResponse) => {
        if(error.status === 404) {
          alert("User not found");
        }
        else {
          console.error('Error fetching user data', error);
          alert(`Error fetching user data`);
        }

      },
    });
  }

// Hàm gọi loadUser khi người dùng nhấn nút tìm kiếm
  searchUser(): void {
    this.loadUser();
  }

  editUser(user: UserDTO): void {
    this.selectedUser = { ...user, isEditing:true }; // Copy user data to selectedUser for editing
  }

  updateUser(): void {
    if (this.selectedUser) {
      this.userService.updateUser(this.selectedUser.id, this.selectedUser).subscribe({
        next: (updatedUser) => {
          alert('User updated successfully');
          this.selectedUser = null; // Reset after update
          this.loadUsers(); // Refresh user list
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error updating user data', error);
          alert('Failed to update user');
        }
      });
    }
  }

  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          alert('User deleted successfully');
          this.loadUsers(); // Reload users to reflect changes
        },
        error: (error) => {
          console.error('Error deleting user', error);
          alert('Failed to delete user');
        }
      });
    }
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


}
