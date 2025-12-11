import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HeaderComponent } from "../../shared/header/header.component";
import { IonContent, IonButton, IonIcon, IonInput, IonItem, IonLabel, IonSelect, IonSelectOption } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { eyeOutline, eyeOffOutline, mailOutline, lockClosedOutline, personOutline, callOutline, calendarOutline, medicalOutline, checkmarkCircleOutline } from 'ionicons/icons';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, HeaderComponent, IonContent, IonButton, IonIcon, IonInput, IonItem, IonLabel, IonSelect, IonSelectOption],
})
export class RegisterComponent implements OnInit {
  formularioRegistro: FormGroup;
  mostrarContrasena = false;
  cargandoRegistro = false;
  mensajeError = '';
  
  tiposDocumento = [
    { valor: 'DNI', texto: 'DNI' },
    { valor: 'PASAPORTE', texto: 'Pasaporte' }
  ];
  
  generos = [
    { valor: 'MASCULINO', texto: 'Masculino' },
    { valor: 'FEMENINO', texto: 'Femenino' },
    { valor: 'OTRO', texto: 'Otro' }
  ];

  constructor(
    private constructorFormulario: FormBuilder,
    private enrutador: Router,
    private authService: AuthService
  ) {
    addIcons({
      eyeOutline,
      eyeOffOutline,
      mailOutline,
      lockClosedOutline,
      personOutline,
      callOutline,
      calendarOutline,
      medicalOutline,
      checkmarkCircleOutline
    });

    this.formularioRegistro = this.constructorFormulario.group({
      primerNombre: ['', [Validators.required, Validators.minLength(2)]],
      segundoNombre: [''],
      primerApellido: ['', [Validators.required, Validators.minLength(2)]],
      segundoApellido: [''],
      tipoDocumento: ['DNI', [Validators.required]],
      numeroDocumento: ['', [Validators.required, Validators.minLength(8)]],
      fechaNacimiento: ['', [Validators.required, this.validadorEdadMinima]],
      genero: ['', [Validators.required]],
      numeroTelefono: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
      urlFotoPerfil: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      aceptarTerminos: [false, [Validators.requiredTrue]]
    });
  }

  ngOnInit() {}

  // Validador personalizado para edad mínima (18 años)
  validadorEdadMinima(control: AbstractControl) {
    if (!control.value) return null;
    
    const fechaNacimiento = new Date(control.value);
    const hoy = new Date();
    const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mesActual = hoy.getMonth();
    const mesNacimiento = fechaNacimiento.getMonth();
    
    if (mesActual < mesNacimiento || (mesActual === mesNacimiento && hoy.getDate() < fechaNacimiento.getDate())) {
      return edad - 1 >= 18 ? null : { edadMinima: true };
    }
    
    return edad >= 18 ? null : { edadMinima: true };
  }

  alternarVisibilidadContrasena() {
    this.mostrarContrasena = !this.mostrarContrasena;
  }

  async enviarFormulario() {
    if (this.formularioRegistro.valid) {
      this.cargandoRegistro = true;
      this.mensajeError = '';
      
      const formValue = this.formularioRegistro.value;
      
      const registroData = {
        persona: {
          primerNombre: formValue.primerNombre,
          segundoNombre: formValue.segundoNombre || null,
          primerApellido: formValue.primerApellido,
          segundoApellido: formValue.segundoApellido || null,
          tipoDocumento: formValue.tipoDocumento,
          numeroDocumento: formValue.numeroDocumento,
          fechaNacimiento: formValue.fechaNacimiento,
          genero: formValue.genero,
          numeroTelefono: formValue.numeroTelefono,
          urlFotoPerfil: formValue.urlFotoPerfil || null
        },
        email: formValue.email,
        password: formValue.password
      };
      
      this.authService.register(registroData).subscribe({
        next: (response) => {
          console.log('Registro exitoso:', response);
          this.cargandoRegistro = false;
          // Redirigir al login después del registro exitoso
          this.enrutador.navigate(['/login']);
        },
        error: (error) => {
          console.error('Error en registro:', error);
          this.mensajeError = error.error?.message || 'Error al registrar. Por favor, intente nuevamente.';
          this.cargandoRegistro = false;
        }
      });
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.formularioRegistro.controls).forEach(clave => {
        this.formularioRegistro.get(clave)?.markAsTouched();
      });
    }
  }

  obtenerMensajeError(nombreCampo: string): string {
    const campo = this.formularioRegistro.get(nombreCampo);
    if (campo?.errors && campo.touched) {
      if (campo.errors['required']) {
        return `${this.obtenerEtiquetaCampo(nombreCampo)} es requerido`;
      }
      if (campo.errors['email']) {
        return 'Ingresa un email válido';
      }
      if (campo.errors['minlength']) {
        const longitudMinima = campo.errors['minlength'].requiredLength;
        return `Debe tener al menos ${longitudMinima} caracteres`;
      }
      if (campo.errors['pattern']) {
        if (nombreCampo === 'numeroTelefono') {
          return 'El teléfono debe tener 9 dígitos';
        }
      }
      if (campo.errors['edadMinima']) {
        return 'Debes ser mayor de 18 años';
      }
      if (campo.errors['requiredTrue']) {
        return 'Debes aceptar los términos y condiciones';
      }
    }
    
    return '';
  }

  private obtenerEtiquetaCampo(nombreCampo: string): string {
    const etiquetas: { [key: string]: string } = {
      'primerNombre': 'Primer nombre',
      'segundoNombre': 'Segundo nombre',
      'primerApellido': 'Primer apellido',
      'segundoApellido': 'Segundo apellido',
      'tipoDocumento': 'Tipo de documento',
      'numeroDocumento': 'Número de documento',
      'fechaNacimiento': 'Fecha de nacimiento',
      'genero': 'Género',
      'numeroTelefono': 'Teléfono',
      'urlFotoPerfil': 'URL de foto',
      'email': 'Email',
      'password': 'Contraseña'
    };
    return etiquetas[nombreCampo] || nombreCampo;
  }

}
