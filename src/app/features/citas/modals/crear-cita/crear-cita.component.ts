import { Component, OnInit, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon, IonInput, IonItem, IonSelect, IonSelectOption, IonSpinner, ModalController, AlertController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close, calendarOutline, timeOutline, locationOutline, medicalOutline, cashOutline, pricetagOutline, flagOutline, shieldOutline, saveOutline, addCircleOutline } from 'ionicons/icons';
import { CitaMedicaService } from '../../cita-medica.service';
import { CitaRequest } from '../../../../core/models/api-models';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-crear-cita',
  templateUrl: './crear-cita.component.html',
  styleUrls: ['./crear-cita.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon, IonInput, IonItem, IonSelect, IonSelectOption, IonSpinner]
})
export class CrearCitaComponent implements OnInit {
  @Input() doctorId?: number;
  @Input() citaId?: number; // Para modo edición
  @Input() modoEdicion = false;
  
  formularioCita: FormGroup;
  guardandoCita = false;
  cargandoDatos = false;
  
  consultoriosDisponibles = [
    { id: 1, numero: '101', piso: '1er Piso' },
    { id: 2, numero: '102', piso: '1er Piso' },
    { id: 3, numero: '201', piso: '2do Piso' },
    { id: 4, numero: '202', piso: '2do Piso' },
    { id: 5, numero: '301', piso: '3er Piso' }
  ];

  segurosDisponibles = [
    { id: 1, nombre: 'Sin Seguro' },
    { id: 2, nombre: 'EsSalud' },
    { id: 3, nombre: 'Pacífico Seguros' },
    { id: 4, nombre: 'Rímac Seguros' },
    { id: 5, nombre: 'Mapfre' }
  ];

  constructor(
    private constructorFormulario: FormBuilder,
    private controladorModal: ModalController,
    private citaMedicaService: CitaMedicaService,
    private authService: AuthService,
    private alertController: AlertController
  ) {
    console.log('CrearCitaComponent constructor ejecutado');
    addIcons({
      close,
      calendarOutline,
      timeOutline,
      locationOutline,
      medicalOutline,
      cashOutline,
      pricetagOutline,
      flagOutline,
      shieldOutline,
      saveOutline,
      addCircleOutline
    });

    this.formularioCita = this.constructorFormulario.group({
      consultorioId: [1, [Validators.required]],
      fechaCita: ['', [Validators.required, this.validadorFechaFutura]],
      horaCita: ['', [Validators.required]],
      tipoAtencion: ['PRESENCIAL', [Validators.required]],
      duracionMinutos: [30, [Validators.required, Validators.min(15)]],
      precioBase: [{value: 150, disabled: true}, [Validators.required, Validators.min(0)]],
      montoDescuento: [{value: 25, disabled: true}, [Validators.min(0)]],
      estado: ['PENDIENTE', [Validators.required]],
      seguroId: [null]
    });
  }

  ngOnInit() {
    console.log('CrearCitaComponent inicializado', { modoEdicion: this.modoEdicion, doctorId: this.doctorId, citaId: this.citaId });
    this.configurarFormulario();
  }
  
  configurarFormulario() {
    if (this.modoEdicion && this.citaId) {
      // Cargar datos de la cita para editar
      this.cargarDatosCita();
    } else if (this.doctorId) {
      // No hacer nada, el doctorId se usará al guardar
      console.log('Doctor preseleccionado:', this.doctorId);
    }
  }

  cargarDatosCita() {
    this.cargandoDatos = true;
    this.citaMedicaService.obtener(this.citaId!).subscribe({
      next: (cita) => {
        console.log('Datos de cita cargados:', cita);
        this.formularioCita.patchValue({
          consultorioId: cita.consultorioId,
          fechaCita: cita.fechaCita,
          horaCita: cita.horaCita.substring(0, 5), // Convertir HH:mm:ss a HH:mm
          tipoAtencion: cita.tipoAtencion,
          duracionMinutos: cita.duracionMinutos,
          estado: cita.estado,
          seguroId: cita.seguroId || null
        });
        // Los campos precioBase y montoDescuento están deshabilitados, usar setValue para campos disabled
        this.formularioCita.get('precioBase')?.setValue(cita.precioBase);
        this.formularioCita.get('montoDescuento')?.setValue(cita.montoDescuento);
        this.cargandoDatos = false;
      },
      error: (error) => {
        console.error('Error al cargar datos de cita:', error);
        this.mostrarError('No se pudieron cargar los datos de la cita.');
        this.cargandoDatos = false;
      }
    });
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
        const citaRequest = this.construirCitaRequest();
        
        if (this.modoEdicion && this.citaId) {
          // Actualizar cita existente
          console.log('Actualizando cita:', citaRequest);
          this.citaMedicaService.actualizar(this.citaId, citaRequest).subscribe({
            next: async (response) => {
              console.log('Cita actualizada exitosamente:', response);
              await this.mostrarExito('La cita se ha actualizado correctamente.');
              await this.controladorModal.dismiss({ citaActualizada: true });
            },
            error: async (error) => {
              console.error('Error al actualizar cita:', error);
              await this.mostrarError('No se pudo actualizar la cita. Por favor, intenta nuevamente.');
              this.guardandoCita = false;
            }
          });
        } else {
          // Crear nueva cita
          console.log('Creando cita:', citaRequest);
          this.citaMedicaService.crear(citaRequest).subscribe({
            next: async (response) => {
              console.log('Cita creada exitosamente:', response);
              await this.mostrarExito('La cita se ha creado correctamente.');
              await this.controladorModal.dismiss({ citaCreada: true });
            },
            error: async (error) => {
              console.error('Error al crear cita:', error);
              await this.mostrarError('No se pudo crear la cita. Por favor, intenta nuevamente.');
              this.guardandoCita = false;
            }
          });
        }
        
      } catch (error) {
        console.error('Error al guardar cita:', error);
        this.guardandoCita = false;
      }
    } else {
      this.marcarCamposComoTocados();
    }
  }
  
  construirCitaRequest(): CitaRequest {
    const formValue = this.formularioCita.getRawValue(); // getRawValue incluye campos disabled
    const user = this.authService.currentUser();
    
    // Formatear la hora a HH:mm:ss
    let horaCitaFormateada = formValue.horaCita;
    if (horaCitaFormateada && horaCitaFormateada.length === 5) {
      horaCitaFormateada = `${horaCitaFormateada}:00`;
    }
    
    return {
      doctorId: this.doctorId!,
      pacienteId: user?.id || 1, // Obtener el ID del usuario logueado
      consultorioId: formValue.consultorioId,
      fechaCita: formValue.fechaCita,
      horaCita: horaCitaFormateada,
      tipoAtencion: formValue.tipoAtencion,
      duracionMinutos: formValue.duracionMinutos,
      precioBase: formValue.precioBase,
      montoDescuento: formValue.montoDescuento,
      estado: formValue.estado,
      seguroId: formValue.seguroId
    };
  }

  async mostrarExito(mensaje?: string) {
    const alert = await this.alertController.create({
      header: 'Éxito',
      message: mensaje || 'La operación se completó correctamente.',
      buttons: ['OK']
    });
    await alert.present();
  }

  async mostrarError(mensaje?: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: mensaje || 'Ocurrió un error. Por favor, intenta nuevamente.',
      buttons: ['OK']
    });
    await alert.present();
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
      if (campo.errors['min']) {
        return `Valor mínimo: ${campo.errors['min'].min}`;
      }
      if (campo.errors['fechaPasada']) {
        return 'La fecha debe ser futura';
      }
    }
    return '';
  }
  
  private obtenerEtiquetaCampo(nombreCampo: string): string {
    const etiquetas: { [key: string]: string } = {
      'consultorioId': 'Consultorio',
      'fechaCita': 'Fecha',
      'horaCita': 'Hora',
      'tipoAtencion': 'Tipo de atención',
      'duracionMinutos': 'Duración',
      'precioBase': 'Precio base',
      'montoDescuento': 'Descuento',
      'estado': 'Estado'
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
