import { Component, OnInit, inject} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import { HeaderComponent } from "./layout/header/header.component";
import { FooterComponent } from "./layout/footer/footer.component";
import {Button} from "primeng/button";
import {ToastModule} from "primeng/toast";

import {MessageService} from 'primeng/api';


@Component({
  selector: 'app-root',
  standalone: true,
  imports:
  [ RouterOutlet,
    HeaderComponent,
    FooterComponent,
    Button,
    ToastModule,
    HomeComponent

  ],
  providers:[MessageService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  messageService= inject(MessageService);
  title = 'shopweb-angular';
  ngOnInit(): void {

  }

}



