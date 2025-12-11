import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { ModalController } from '@ionic/angular/standalone';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent, IonSpinner } from '@ionic/angular/standalone';
import { DoctorService } from '../../doctor.service';

@Component({
  selector: 'app-editar-doctor',
  templateUrl: './editar-doctor.component.html',
  styleUrls: ['./editar-doctor.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent, IonSpinner]
})
export class EditarDoctorComponent implements OnInit {
  @Input() doctorId!: number;
  
  doctorForm!: FormGroup;
  enviando = false;
  cargando = true;
  
  tiposDocumento = ['DNI', 'PASAPORTE', 'CARNET_EXTRANJERIA'];
  generos = ['MASCULINO', 'FEMENINO', 'OTRO'];

  constructor(
    private fb: FormBuilder,
    private modalController: ModalController,
    private doctorService: DoctorService
  ) {}

  ngOnInit() {
    this.inicializarFormulario();
    this.cargarDatosDoctor();
  }

  inicializarFormulario() {
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
      numeroColegiatura: [''],
      especialidadIds: this.fb.array([], Validators.required)
    });
  }

  cargarDatosDoctor() {
    this.cargando = true;
    this.doctorService.obtener(this.doctorId).subscribe({
      next: (doctor) => {
        this.doctorForm.patchValue({
          persona: doctor.persona,
          numeroColegiatura: doctor.numeroColegiatura
        });
        
        // Limpiar y agregar especialidades
        const especialidadesArray = this.especialidadIdsArray;
        especialidadesArray.clear();
        doctor.especialidadIds.forEach(id => {
          especialidadesArray.push(this.fb.control(id));
        });
        
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar doctor:', error);
        this.cargando = false;
      }
    });
  }

  get especialidadIdsArray(): FormArray {
    return this.doctorForm.get('especialidadIds') as FormArray;
  }

  get personaForm() {
    return this.doctorForm.get('persona') as FormGroup;
  }

  agregarEspecialidad() {
    this.especialidadIdsArray.push(this.fb.control('', Validators.required));
  }

  eliminarEspecialidad(index: number) {
    this.especialidadIdsArray.removeAt(index);
  }

  cerrarModal() {
    this.modalController.dismiss();
  }

  async guardarCambios() {
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

    const doctorData = {
      persona: this.doctorForm.value.persona,
      numeroColegiatura: this.doctorForm.value.numeroColegiatura || null,
      especialidadIds: this.especialidadIdsArray.value.map((id: string) => parseInt(id))
    };

    this.doctorService.actualizar(this.doctorId, doctorData).subscribe({
      next: (response) => {
        this.enviando = false;
        this.modalController.dismiss({ doctorActualizado: true });
      },
      error: (error) => {
        console.error('Error al actualizar doctor:', error);
        this.enviando = false;
        alert('Error al actualizar el doctor. Por favor, intente nuevamente.');
      }
    });
  }

  mostrarError(campo: string): boolean {
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
    if (campo.includes('.')) {
      const [grupo, nombreCampo] = campo.split('.');
      control = this.doctorForm.get(grupo)?.get(nombreCampo);
    } else {
      control = this.doctorForm.get(campo);
    }
    
    if (control?.hasError('required')) {
      return 'Este campo es obligatorio';
    }
    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `Mínimo ${minLength} caracteres`;
    }
    if (control?.hasError('pattern')) {
      return 'Formato inválido';
    }
    return '';
  }
}
