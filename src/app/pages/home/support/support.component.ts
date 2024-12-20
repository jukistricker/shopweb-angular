import { Component } from '@angular/core';
import {HeaderComponent} from '../../../layout/header/header.component';
import {FooterComponent} from '../../../layout/footer/footer.component';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, NgOptimizedImage],
  templateUrl: './support.component.html',
  styleUrl: './support.component.scss'
})
export class SupportComponent {

}
