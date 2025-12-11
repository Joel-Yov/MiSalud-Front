import { AuthService } from './../../core/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonHeader, IonToolbar, IonButton } from "@ionic/angular/standalone";

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [IonHeader, IonToolbar, IonButton, RouterLink],
})
export class HeaderComponent  implements OnInit {

  constructor(private authService: AuthService) { }

  get esRolPaciente(): boolean {
    const user = this.authService.currentUser();
    return user?.rol === 'PACIENTE';
  }

  ngOnInit() {}

}
