import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../feature/auth/auth.service';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {UserService} from '../admin-sidebar/user/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UserDTO} from '../../model/user.model';
import {NgFor, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';


@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [NgIf,NgFor,FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent {




}
