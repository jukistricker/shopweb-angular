import { Component } from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {AdminNavbarComponent} from "../admin-navbar/admin-navbar.component";
import {AdminFooterComponent} from "../admin-footer/admin-footer.component";
import {AdminSidebarComponent} from "../admin-sidebar/admin-sidebar.component";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, AdminNavbarComponent, AdminFooterComponent, AdminSidebarComponent, CommonModule],
  templateUrl: 'admin-layout.component.html',
  styleUrl: 'admin-layout.component.scss'
})
export class AdminLayoutComponent {
  isSidebarOpen = false;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
