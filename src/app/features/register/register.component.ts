import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../../shared/header/header.component";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [CommonModule, HeaderComponent],
})
export class RegisterComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
