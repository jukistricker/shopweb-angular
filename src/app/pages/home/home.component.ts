import { Component } from '@angular/core';
import {HeaderComponent} from '../../layout/header/header.component';
import {FooterComponent} from '../../layout/footer/footer.component';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, NgOptimizedImage],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
