import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon, IonInput, IonItem, IonSelect, IonSelectOption, IonTextarea } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close, personOutline, medicalOutline, calendarOutline, timeOutline, locationOutline, documentTextOutline, saveOutline, addCircleOutline } from 'ionicons/icons';
import { CitaCard } from '../../citas.component';

@Component({
  selector: 'app-crear-cita',
  templateUrl: './crear-cita.component.html',
  styleUrls: ['./crear-cita.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon, IonInput, IonItem, IonSelect, IonSelectOption, IonTextarea]
})
export class CrearCitaComponent implements OnInit {
  @Input() citaParaEditar?: CitaCard;
  @Input() modoEdicion = false;
  
  formularioCita: FormGroup;
  guardandoCita = false;
  
  pacientesDisponibles = [
    { id: 1, nombre: 'Juan Pérez García', documento: '12345678' },
    { id: 2, nombre: 'María González López', documento: '87654321' },
    { id: 3, nombre: 'Carlos Rodríguez Martín', documento: '11223344' },
    { id: 4, nombre: 'Ana Fernández Torres', documento: '44332211' },
    { id: 5, nombre: 'Luis García Sánchez', documento: '55667788' }
  ];
  
  doctoresDisponibles = [
    { id: 1, nombre: 'Dr. Roberto Mendoza', especialidad: 'Cardiología' },
    { id: 2, nombre: 'Dra. María González López', especialidad: 'Neurología' },
    { id: 3, nombre: 'Dr. Carlos López Herrera', especialidad: 'Pediatría' },
    { id: 4, nombre: 'Dra. Ana Torres Ruiz', especialidad: 'Ginecología' },
    { id: 5, nombre: 'Dr. Luis Fernández Castro', especialidad: 'Dermatología' }
  ];
  
  consultoriosDisponibles = [
    { numero: '101', piso: '1er Piso' },
    { numero: '102', piso: '1er Piso' },
    { numero: '201', piso: '2do Piso' },
    { numero: '202', piso: '2do Piso' },
    { numero: '301', piso: '3er Piso' }
  ];
  
  horariosDisponibles = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30'
  ];

  constructor(
    private constructorFormulario: FormBuilder,
    private controladorModal: ModalController
  ) {
    console.log('CrearCitaComponent constructor ejecutado');
    addIcons({
      close,
      personOutline,
      medicalOutline,
      calendarOutline,
      timeOutline,
      locationOutline,
      documentTextOutline,
      saveOutline,
      addCircleOutline
    });

    this.formularioCita = this.constructorFormulario.group({
      pacienteId: ['', [Validators.required]],
      doctorId: ['', [Validators.required]],
      fechaCita: ['', [Validators.required, this.validadorFechaFutura]],
      horaCita: ['', [Validators.required]],
      consultorioNumero: ['', [Validators.required]],
      motivoConsulta: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      observaciones: ['', [Validators.maxLength(1000)]]
    });
  }

  ngOnInit() {
    console.log('CrearCitaComponent inicializado', { modoEdicion: this.modoEdicion, citaParaEditar: this.citaParaEditar });
    this.configurarFormulario();
  }
  
  configurarFormulario() {
    if (this.modoEdicion && this.citaParaEditar) {
      // Llenar formulario con datos existentes para edición
      const pacienteSeleccionado = this.pacientesDisponibles.find(
        p => p.nombre === this.citaParaEditar?.paciente.nombre
      );
      const doctorSeleccionado = this.doctoresDisponibles.find(
        d => d.nombre === this.citaParaEditar?.doctor.nombre
      );
      const consultorioSeleccionado = this.consultoriosDisponibles.find(
        c => c.numero === this.citaParaEditar?.consultorio
      );
      
      this.formularioCita.patchValue({
        pacienteId: pacienteSeleccionado?.id || '',
        doctorId: doctorSeleccionado?.id || '',
        fechaCita: this.obtenerFechaISO(),
        horaCita: this.citaParaEditar.hora,
        consultorioNumero: consultorioSeleccionado?.numero || '',
        motivoConsulta: this.citaParaEditar.motivo,
        observaciones: ''
      });
    }
  }
  
  obtenerFechaISO(): string {
    // Simular fecha actual para el ejemplo
    const hoy = new Date();
    hoy.setDate(hoy.getDate() + 1); // Día siguiente
    return hoy.toISOString();
  }
  
  validadorFechaFutura(control: any) {
    if (!control.value) return null;
    
    const fechaSeleccionada = new Date(control.value);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    return fechaSeleccionada >= hoy ? null : { fechaPasada: true };
  }

  async cerrarModal() {
    await this.controladorModal.dismiss();
  }
  
  async guardarCita() {
    if (this.formularioCita.valid) {
      this.guardandoCita = true;
      
      try {
        const datosCita = this.construirDatosCita();
        console.log(this.modoEdicion ? 'Editando cita:' : 'Creando cita:', datosCita);
        
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Cerrar modal con los datos
        await this.controladorModal.dismiss({
          accion: this.modoEdicion ? 'editar' : 'crear',
          datos: datosCita
        });
        
      } catch (error) {
        console.error('Error al guardar cita:', error);
      } finally {
        this.guardandoCita = false;
      }
    } else {
      this.marcarCamposComoTocados();
    }
  }
  
  construirDatosCita() {
    const formValue = this.formularioCita.value;
    const pacienteSeleccionado = this.pacientesDisponibles.find(p => p.id === formValue.pacienteId);
    const doctorSeleccionado = this.doctoresDisponibles.find(d => d.id === formValue.doctorId);
    const consultorioSeleccionado = this.consultoriosDisponibles.find(c => c.numero === formValue.consultorioNumero);
    
    return {
      id: this.modoEdicion ? this.citaParaEditar?.citaId : Date.now(),
      paciente: {
        nombre: pacienteSeleccionado?.nombre || '',
        documento: `Doc: ${pacienteSeleccionado?.documento}` || ''
      },
      doctor: {
        nombre: doctorSeleccionado?.nombre || '',
        especialidad: doctorSeleccionado?.especialidad || ''
      },
      consultorio: consultorioSeleccionado?.numero || '',
      piso: consultorioSeleccionado?.piso || '',
      fecha: formValue.fechaCita,
      hora: formValue.horaCita,
      motivo: formValue.motivoConsulta,
      observaciones: formValue.observaciones,
      estado: this.modoEdicion ? this.citaParaEditar?.estado : 'programada'
    };
  }
  
  marcarCamposComoTocados() {
    Object.keys(this.formularioCita.controls).forEach(campo => {
      this.formularioCita.get(campo)?.markAsTouched();
    });
  }
  
  obtenerMensajeError(nombreCampo: string): string {
    const campo = this.formularioCita.get(nombreCampo);
    if (campo?.errors && campo.touched) {
      if (campo.errors['required']) {
        return `${this.obtenerEtiquetaCampo(nombreCampo)} es requerido`;
      }
      if (campo.errors['minlength']) {
        return `Mínimo ${campo.errors['minlength'].requiredLength} caracteres`;
      }
      if (campo.errors['maxlength']) {
        return `Máximo ${campo.errors['maxlength'].requiredLength} caracteres`;
      }
      if (campo.errors['fechaPasada']) {
        return 'La fecha debe ser futura';
      }
    }
    return '';
  }
  
  private obtenerEtiquetaCampo(nombreCampo: string): string {
    const etiquetas: { [key: string]: string } = {
      'pacienteId': 'Paciente',
      'doctorId': 'Doctor',
      'fechaCita': 'Fecha',
      'horaCita': 'Hora',
      'consultorioNumero': 'Consultorio',
      'motivoConsulta': 'Motivo de consulta'
    };
    return etiquetas[nombreCampo] || nombreCampo;
  }
  
  obtenerTituloModal(): string {
    return this.modoEdicion ? 'Editar Cita Médica' : 'Programar Nueva Cita Médica';
  }
  
  obtenerTextoBoton(): string {
    if (this.guardandoCita) {
      return this.modoEdicion ? 'Guardando cambios...' : 'Programando cita...';
    }
    return this.modoEdicion ? 'Guardar Cambios' : 'Programar Cita';
  }

}
