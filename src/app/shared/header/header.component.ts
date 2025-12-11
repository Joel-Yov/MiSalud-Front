import { AuthService } from './../../core/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonHeader, IonToolbar, IonButton } from "@ionic/angular/standalone";
import { AuthUser } from '../../core/models/api-models';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [IonHeader, IonToolbar, IonButton, RouterLink],
})
export class HeaderComponent  implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  get esRolPaciente(): boolean {
    const user = this.authService.currentUser();
    return user?.rol === 'PACIENTE';
  }

  get usuarioActual(): AuthUser | null {
    return this.authService.currentUser();
  }

  get estaAutenticado(): boolean {
    return this.authService.isAuthenticated();
  }

  get nombreUsuario(): string {
    const user = this.usuarioActual;
    if (user?.nombre) {
      return user.nombre;
    }
    if (user?.username) {
      return user.username;
    }
    return user?.email || 'Usuario';
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  ngOnInit() {}

}
