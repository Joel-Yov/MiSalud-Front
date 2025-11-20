import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../../shared/header/header.component";

@Component({
  selector: 'app-citas',
  templateUrl: './citas.component.html',
  styleUrls: ['./citas.component.scss'],
  standalone: true,
  imports: [CommonModule, HeaderComponent],
})
export class CitasComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
