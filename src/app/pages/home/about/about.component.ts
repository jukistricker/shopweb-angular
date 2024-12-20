import { Component } from '@angular/core';
import {HeaderComponent} from '../../../layout/header/header.component';
import {FooterComponent} from '../../../layout/footer/footer.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [HeaderComponent,FooterComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {

}
