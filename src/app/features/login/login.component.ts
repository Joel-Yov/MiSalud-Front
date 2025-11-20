import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HeaderComponent } from "../../shared/header/header.component";
import { IonContent, IonButton, IonIcon, IonInput, IonItem, IonLabel } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { eyeOutline, eyeOffOutline, mailOutline, lockClosedOutline, logInOutline, medical } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, HeaderComponent, IonContent, IonButton, IonIcon, IonInput, IonItem, IonLabel],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  showPassword = false;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    addIcons({
      eyeOutline,
      eyeOffOutline,
      mailOutline,
      lockClosedOutline,
      logInOutline,
      medical
    });

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      
      try {
        // Simular login (aquí iría la lógica real de autenticación)
        console.log('Login data:', this.loginForm.value);
        
        // Simular delay de la API
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Redirigir al apartado de CITAS
        this.router.navigate(['/citas']);
        
      } catch (error) {
        console.error('Error en login:', error);
      } finally {
        this.isLoading = false;
      }
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }

  getErrorMessage(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${fieldName === 'email' ? 'Email' : 'Contraseña'} es requerido`;
      }
      if (field.errors['email']) {
        return 'Ingresa un email válido';
      }
      if (field.errors['minlength']) {
        return 'La contraseña debe tener al menos 6 caracteres';
      }
    }
    return '';
  }

}
