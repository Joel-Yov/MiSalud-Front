import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonButton } from "@ionic/angular/standalone";

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [IonHeader, IonToolbar, IonButton],
})
export class HeaderComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
