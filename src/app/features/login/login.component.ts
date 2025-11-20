import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../../shared/header/header.component";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, HeaderComponent],
})
export class LoginComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

}
