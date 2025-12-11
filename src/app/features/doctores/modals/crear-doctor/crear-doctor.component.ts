import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { ModalController } from '@ionic/angular/standalone';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent } from '@ionic/angular/standalone';
import { DoctorService } from '../../doctor.service';

@Component({
  selector: 'app-crear-doctor',
  templateUrl: './crear-doctor.component.html',
  styleUrls: ['./crear-doctor.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent]
})
export class CrearDoctorComponent implements OnInit {
  doctorForm!: FormGroup;
  enviando = false;
  
  diasSemana = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];
  tiposDocumento = ['DNI', 'PASAPORTE'];
  generos = ['MASCULINO', 'FEMENINO', 'OTRO'];

  constructor(
    private fb: FormBuilder,
    private modalController: ModalController,
    private doctorService: DoctorService
  ) {}

  ngOnInit() {
    this.doctorForm = this.fb.group({
      persona: this.fb.group({
        primerNombre: ['', [Validators.required, Validators.minLength(2)]],
        segundoNombre: [''],
        primerApellido: ['', [Validators.required, Validators.minLength(2)]],
        segundoApellido: [''],
        tipoDocumento: ['DNI', Validators.required],
        numeroDocumento: ['', [Validators.required, Validators.minLength(8)]],
        fechaNacimiento: ['', Validators.required],
        genero: ['', Validators.required],
        numeroTelefono: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
        urlFotoPerfil: ['']
      }),
      colegiaturaNumero: ['', [Validators.required, Validators.minLength(5)]],
      especialidadIds: this.fb.array([this.fb.control('', [Validators.required, Validators.min(1)])]),
      consultorioId: ['', [Validators.required, Validators.min(1)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      diasDisponibles: this.fb.array(
        this.diasSemana.map(() => this.fb.control(false))
      ),
      horaInicioJornada: ['', Validators.required],
      horaFinJornada: ['', Validators.required],
      precioConsulta: ['', [Validators.required, Validators.min(0)]]
    });
  }

  get especialidadIdsArray(): FormArray {
    return this.doctorForm.get('especialidadIds') as FormArray;
  }

  get diasDisponiblesArray(): FormArray {
    return this.doctorForm.get('diasDisponibles') as FormArray;
  }

  get personaForm() {
    return this.doctorForm.get('persona') as FormGroup;
  }

  agregarEspecialidad() {
    this.especialidadIdsArray.push(this.fb.control('', [Validators.required, Validators.min(1)]));
  }

  eliminarEspecialidad(index: number) {
    if (this.especialidadIdsArray.length > 1) {
      this.especialidadIdsArray.removeAt(index);
    }
  }

  cerrarModal() {
    this.modalController.dismiss();
  }

  async guardarDoctor() {
    if (this.doctorForm.invalid) {
      Object.keys(this.doctorForm.controls).forEach(key => {
        this.doctorForm.get(key)?.markAsTouched();
      });
      Object.keys(this.personaForm.controls).forEach(key => {
        this.personaForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.enviando = true;

    // Construir el array de días seleccionados
    const diasSeleccionados = this.diasSemana.filter(
      (dia, index) => this.diasDisponiblesArray.at(index).value
    );

    const doctorData = {
      ...this.doctorForm.value,
      especialidadIds: this.especialidadIdsArray.value.map((id: string) => parseInt(id)),
      diasDisponibles: diasSeleccionados
    };

    this.doctorService.crear(doctorData).subscribe({
      next: (response) => {
        this.enviando = false;
        this.modalController.dismiss({ doctorCreado: true });
      },
      error: (error) => {
        console.error('Error al crear doctor:', error);
        this.enviando = false;
        alert('Error al crear el doctor. Por favor, intente nuevamente.');
      }
    });
  }

  // Métodos de validación para mostrar errores
  mostrarError(campo: string): boolean {
    // Manejo de campos anidados
    if (campo.includes('.')) {
      const [grupo, nombreCampo] = campo.split('.');
      const control = this.doctorForm.get(grupo)?.get(nombreCampo);
      return !!(control && control.invalid && control.touched);
    }
    const control = this.doctorForm.get(campo);
    return !!(control && control.invalid && control.touched);
  }

  obtenerMensajeError(campo: string): string {
    let control;
    // Manejo de campos anidados
    if (campo.includes('.')) {
      const [grupo, nombreCampo] = campo.split('.');
      control = this.doctorForm.get(grupo)?.get(nombreCampo);
    } else {
      control = this.doctorForm.get(campo);
    }
    
    if (control?.hasError('required')) {
      return 'Este campo es obligatorio';
    }
    if (control?.hasError('email')) {
      return 'Email inválido';
    }
    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `Mínimo ${minLength} caracteres`;
    }
    if (control?.hasError('pattern')) {
      return 'Formato inválido';
    }
    if (control?.hasError('min')) {
      return 'Valor debe ser mayor a 0';
    }
    return '';
  }
}
