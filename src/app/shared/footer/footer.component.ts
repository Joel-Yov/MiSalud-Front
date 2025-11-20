import { Component, OnInit } from '@angular/core';
import { IonFooter, IonToolbar, IonIcon } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { logoFacebook, logoInstagram, logoTwitter, logoLinkedin } from 'ionicons/icons';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  imports: [IonFooter, IonToolbar, IonIcon],
})
export class FooterComponent  implements OnInit {

  constructor() {
    // Registrar los iconos que vamos a usar
    addIcons({ logoFacebook, logoInstagram, logoTwitter, logoLinkedin });
  }

  ngOnInit() {}

}
