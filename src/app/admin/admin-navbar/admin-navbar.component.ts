import {Component, EventEmitter, Output} from '@angular/core';
import {ActivatedRoute, RouterLink} from "@angular/router";
import {Router} from '@angular/router';
import {AuthService} from '../../feature/auth/auth.service';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [RouterLink,],
  templateUrl: 'admin-navbar.component.html',
  styleUrl: 'admin-navbar.component.scss',
})
export class AdminNavbarComponent {
  @Output() toggle = new EventEmitter<void>();

  constructor(private router: Router, public authService: AuthService, private activatedRoute: ActivatedRoute) {}

  toggleSidebar() {
    this.toggle.emit();
  }
  logout(){
    this.authService.logout();
    this.router.navigate(['/']);
    this.router.navigate(['/logout']);
  }
}
