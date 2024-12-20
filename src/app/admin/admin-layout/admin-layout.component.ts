import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterOutlet} from "@angular/router";
import {AdminNavbarComponent} from "../admin-navbar/admin-navbar.component";
import {AdminFooterComponent} from "../admin-footer/admin-footer.component";
import {AdminSidebarComponent} from "../admin-sidebar/admin-sidebar.component";
import {CommonModule} from "@angular/common";
import {UserDTO} from '../../model/user.model';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {AuthService} from '../../feature/auth/auth.service';
import {UserService} from '../admin-sidebar/user/user.service';
import {HeaderComponent} from '../../layout/header/header.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, AdminNavbarComponent, AdminFooterComponent, AdminSidebarComponent, CommonModule, HeaderComponent],
  templateUrl: 'admin-layout.component.html',
  styleUrl: 'admin-layout.component.scss'
})
export class AdminLayoutComponent implements OnInit{
  isSidebarOpen = false;
  currentUser: any; // To store the current user
  user: UserDTO | null = null; // To store the user data fetched from the API

  userIdFromRoute: number | null = null; // Store the user id from the route
  private loggedIn: boolean = false;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.isLoggedIn();



  }

  isLoggedIn() {
    this.authService.isTokenValid().subscribe({
      next: (response) => {
        this.loggedIn = response.valid; // Nếu token hợp lệ, loggedIn sẽ là true
        if (this.loggedIn && response.user) {
          if (response.user.role!='admin') {
            this.router.navigate(['/']);
          }
          this.currentUser = response.user;
        }
      },
      error: (err) => {

        console.log(err);
        this.loggedIn = false;
        this.router.navigate(['']);
      },
    });
  }

  loadUser(userId: number): void {

    this.userService.getUserById(userId).subscribe({
      next: (data: UserDTO) => {
        this.user = data; // Store the user data returned from the API
        this.userIdFromRoute=data.id;
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


  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
