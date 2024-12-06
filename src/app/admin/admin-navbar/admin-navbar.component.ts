import {Component, EventEmitter, Output} from '@angular/core';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: 'admin-navbar.component.html',
  styleUrl: 'admin-navbar.component.scss',
})
export class AdminNavbarComponent {
  @Output() toggle = new EventEmitter<void>();

  toggleSidebar() {
    this.toggle.emit();
  }
}
