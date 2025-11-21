import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HeaderComponent } from "../../shared/header/header.component";
import { IonContent, IonButton, IonIcon, IonInput, IonItem, IonLabel, IonSelect, IonSelectOption } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { eyeOutline, eyeOffOutline, mailOutline, lockClosedOutline, personOutline, callOutline, calendarOutline, medicalOutline, checkmarkCircleOutline } from 'ionicons/icons';

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
  mostrarConfirmarContrasena = false;
  cargandoRegistro = false;
  
  tiposDocumento = [
    { valor: 'dni', texto: 'DNI' },
    { valor: 'pasaporte', texto: 'Pasaporte' },
  ];
  
  generos = [
    { valor: 'masculino', texto: 'Masculino' },
    { valor: 'femenino', texto: 'Femenino' },
    { valor: 'otro', texto: 'Otro' }
  ];

  constructor(
    private constructorFormulario: FormBuilder,
    private enrutador: Router
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
      nombres: ['', [Validators.required, Validators.minLength(2)]],
      apellidos: ['', [Validators.required, Validators.minLength(2)]],
      tipoDocumento: ['', [Validators.required]],
      numeroDocumento: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      fechaNacimiento: ['', [Validators.required, this.validadorEdadMinima]],
      genero: ['', [Validators.required]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(8), this.validadorContrasenaFuerte]],
      confirmarContrasena: ['', [Validators.required]],
      aceptarTerminos: [false, [Validators.requiredTrue]]
    }, {
      validators: this.validadorContrasenasCoincidir
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

  // Validador para contraseña fuerte
  validadorContrasenaFuerte(control: AbstractControl) {
    if (!control.value) return null;
    
    const contrasena = control.value;
    const tieneMinuscula = /[a-z]/.test(contrasena);
    const tieneMayuscula = /[A-Z]/.test(contrasena);
    const tieneNumero = /[0-9]/.test(contrasena);
    const tieneCaracterEspecial = /[!@#$%^&*(),.?\":{}|<>]/.test(contrasena);
    
    const esValida = tieneMinuscula && tieneMayuscula && tieneNumero && tieneCaracterEspecial;
    
    return esValida ? null : { contrasenaDebil: true };
  }

  // Validador para que las contraseñas coincidan
  validadorContrasenasCoincidir(formulario: AbstractControl) {
    const contrasena = formulario.get('contrasena')?.value;
    const confirmarContrasena = formulario.get('confirmarContrasena')?.value;
    
    return contrasena === confirmarContrasena ? null : { contrasenasNoCoinciden: true };
  }

  alternarVisibilidadContrasena() {
    this.mostrarContrasena = !this.mostrarContrasena;
  }

  alternarVisibilidadConfirmarContrasena() {
    this.mostrarConfirmarContrasena = !this.mostrarConfirmarContrasena;
  }

  async enviarFormulario() {
    if (this.formularioRegistro.valid) {
      this.cargandoRegistro = true;
      
      try {
        // Simular registro (aquí iría la lógica real de registro)
        console.log('Datos de registro:', this.formularioRegistro.value);
        
        // Simular delay de la API
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Redirigir al login después del registro exitoso
        this.enrutador.navigate(['/login']);
        
      } catch (error) {
        console.error('Error en registro:', error);
      } finally {
        this.cargandoRegistro = false;
      }
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
        if (nombreCampo === 'numeroDocumento') {
          return 'Solo se permiten números';
        }
        if (nombreCampo === 'telefono') {
          return 'El teléfono debe tener 9 dígitos';
        }
      }
      if (campo.errors['edadMinima']) {
        return 'Debes ser mayor de 18 años';
      }
      if (campo.errors['contrasenaDebil']) {
        return 'Debe contener mayúscula, minúscula, número y carácter especial';
      }
      if (campo.errors['requiredTrue']) {
        return 'Debes aceptar los términos y condiciones';
      }
    }
    
    if (this.formularioRegistro.errors?.['contrasenasNoCoinciden'] && nombreCampo === 'confirmarContrasena' && campo?.touched) {
      return 'Las contraseñas no coinciden';
    }
    
    return '';
  }

  private obtenerEtiquetaCampo(nombreCampo: string): string {
    const etiquetas: { [key: string]: string } = {
      'nombres': 'Nombres',
      'apellidos': 'Apellidos',
      'tipoDocumento': 'Tipo de documento',
      'numeroDocumento': 'Número de documento',
      'fechaNacimiento': 'Fecha de nacimiento',
      'genero': 'Género',
      'telefono': 'Teléfono',
      'email': 'Email',
      'contrasena': 'Contraseña',
      'confirmarContrasena': 'Confirmar contraseña'
    };
    return etiquetas[nombreCampo] || nombreCampo;
  }

}
