import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalController, AlertController } from '@ionic/angular';
import { HeaderComponent } from "../../shared/header/header.component";
import { FooterComponent } from "../../shared/footer/footer.component";
import { IonContent, IonButton, IonIcon, IonBadge, IonSpinner } from "@ionic/angular/standalone";
import { GenerarQrComponent } from './modals/generar-qr/generar-qr.component';
import { addIcons } from 'ionicons';
import { timeOutline, personOutline, medicalOutline, locationOutline, qrCodeOutline, calendarOutline, addCircleOutline, createOutline, trashOutline, ellipsisVertical } from 'ionicons/icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faPen, faTrash } from '@fortawesome/pro-solid-svg-icons';
import { CitaMedicaService } from './cita-medica.service';
import { CitaResponse, EstadoCita, TipoAtencion } from '../../core/models/api-models';
import { AuthService } from '../../core/auth/auth.service';

export interface CitaCard {
  id: number;
  pacienteId: number;
  doctorId: number;
  consultorioId: number;
  fechaCita: string;
  horaCita: string;
  duracionMinutos: number;
  estado: EstadoCita;
  tipoAtencion: TipoAtencion;
  precioBase: number;
  montoDescuento: number;
  costoNetoCita: number;
  nombreSeguro?: string | null;
  copagoEstimado?: number | null;
  nombreCompletoPaciente?: string | null;
  nombreCompletoDoctor?: string | null;
  nombreConsultorio?: string | null;
  seguroId?: number | null;
}

@Component({
  selector: 'app-citas',
  templateUrl: './citas.component.html',
  styleUrls: ['./citas.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent, IonContent, IonButton, IonIcon, IonBadge, IonSpinner, FontAwesomeModule],
  providers: [ModalController]
})
export class CitasComponent implements OnInit {
  citas: CitaCard[] = [];
  loading = false;
  filtroEstado: EstadoCita | 'TODOS' = 'TODOS';
  filtroTipo: TipoAtencion | 'TODOS' = 'TODOS';
  filtroTexto = '';
  esPaciente = false;

  constructor(
    private modalController: ModalController, 
    private library: FaIconLibrary,
    private citaMedicaService: CitaMedicaService,
    private authService: AuthService,
    private alertController: AlertController
  ) {
    addIcons({
      timeOutline,
      personOutline,
      medicalOutline,
      locationOutline,
      qrCodeOutline,
      calendarOutline,
      addCircleOutline,
      createOutline,
      trashOutline,
      ellipsisVertical
    });
    
    // Agregar iconos de FontAwesome a la librería
    library.addIcons(faPen, faTrash);
  }

  ngOnInit() {
    this.cargarCitas();
  }

  cargarCitas() {
    this.loading = true;
    const user = this.authService.currentUser();
    this.esPaciente = user?.rol === 'PACIENTE';
    
    // NOTA: El patrón es que pacienteId = user.id - 1
    // Ejemplo: user.id = 3 → pacienteId = 2, user.id = 5 → pacienteId = 4
    const pacienteId = user?.id ? user.id - 1 : null;
    
    if (pacienteId) {
      // Usar el endpoint específico para traer solo las citas del paciente
      this.citaMedicaService.listar().subscribe({
        next: (todasLasCitas) => {
          // Filtrar solo las citas del paciente logueado
          const citasDelPaciente = todasLasCitas.filter(cita => cita.pacienteId === pacienteId);
          this.citas = citasDelPaciente.map(this.transformarCitaResponse);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar citas:', error);
          this.loading = false;
        }
      });
    } else {
      // Si no hay usuario logueado, mostrar todas las citas (temporal)
      this.citaMedicaService.listar().subscribe({
        next: (citas) => {
          this.citas = citas.map(this.transformarCitaResponse);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar citas:', error);
          this.loading = false;
        }
      });
    }
  }

  transformarCitaResponse(cita: CitaResponse): CitaCard {
    return {
      id: cita.id,
      pacienteId: cita.pacienteId,
      doctorId: cita.doctorId,
      consultorioId: cita.consultorioId,
      fechaCita: cita.fechaCita,
      horaCita: cita.horaCita,
      duracionMinutos: cita.duracionMinutos,
      estado: cita.estado,
      tipoAtencion: cita.tipoAtencion,
      precioBase: cita.precioBase,
      montoDescuento: cita.montoDescuento,
      costoNetoCita: cita.costoNetoCita,
      nombreSeguro: cita.nombreSeguro ?? null,
      copagoEstimado: cita.copagoEstimado ?? null,
      nombreCompletoPaciente: cita.nombreCompletoPaciente ?? null,
      nombreCompletoDoctor: cita.nombreCompletoDoctor ?? null,
      nombreConsultorio: cita.nombreConsultorio ?? null,
      seguroId: cita.seguroId ?? null
    };
  }

  get citasFiltradas(): CitaCard[] {
    const termino = this.filtroTexto.trim().toLowerCase();
    return this.citas.filter((cita) => {
      const coincideEstado = this.filtroEstado === 'TODOS' || cita.estado === this.filtroEstado;
      const coincideTipo = this.filtroTipo === 'TODOS' || cita.tipoAtencion === this.filtroTipo;
      const camposBusqueda = this.esPaciente
        ? [cita.nombreCompletoDoctor, cita.nombreConsultorio]
        : [cita.nombreCompletoPaciente, cita.nombreCompletoDoctor, cita.nombreConsultorio];
      const coincideTexto = !termino || camposBusqueda.some((campo) => (campo || '').toLowerCase().includes(termino));
      return coincideEstado && coincideTipo && coincideTexto;
    });
  }

  async generarQr(cita: CitaCard) {
    const modal = await this.modalController.create({
      component: GenerarQrComponent,
      componentProps: {
        cita: cita
      },
      cssClass: 'qr-modal',
      backdropDismiss: true
    });
    
    await modal.present();
  }

  async abrirEditarCitaModal(cita: CitaCard) {
    const { CrearCitaComponent } = await import('./modals/crear-cita/crear-cita.component');
    
    const modal = await this.modalController.create({
      component: CrearCitaComponent,
      componentProps: {
        citaId: cita.id,
        doctorId: cita.doctorId,
        modoEdicion: true
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data && data.citaActualizada) {
      console.log('Cita actualizada exitosamente');
      this.cargarCitas();
    }
  }

  async eliminarCita(citaId: number) {
    const alert = await this.alertController.create({
      header: '¿Eliminar Cita?',
      message: '¿Estás seguro de que deseas eliminar esta cita? Esta acción no se puede deshacer.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.confirmarEliminacion(citaId);
          }
        }
      ]
    });

    await alert.present();
  }

  confirmarEliminacion(citaId: number) {
    this.citaMedicaService.eliminar(citaId).subscribe({
      next: () => {
        console.log('Cita eliminada exitosamente');
        window.location.reload();
      },
      error: (error) => {
        console.error('Error al eliminar cita:', error);
        this.mostrarErrorEliminacion();
      }
    });
  }

  async mostrarErrorEliminacion() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'No se pudo eliminar la cita. Por favor, intenta nuevamente.',
      buttons: ['OK']
    });

    await alert.present();
  }

  trackByCitaId(index: number, cita: CitaCard): number {
    return cita.id;
  }

  limpiarFiltros() {
    this.filtroEstado = 'TODOS';
    this.filtroTipo = 'TODOS';
    this.filtroTexto = '';
  }

  obtenerNombreEstado(estado: string): string {
    const estados: { [key: string]: string } = {
      'PENDIENTE': 'Pendiente',
      'CONFIRMADA': 'Confirmada',
      'CANCELADA': 'Cancelada',
      'COMPLETADA': 'Completada',
      'NO_ASISTIO': 'No Asistió'
    };
    return estados[estado] || estado;
  }

  formatearHora(hora?: string | null): string {
    if (!hora) return 'Hora no disponible';
    return hora.slice(0, 5);
  }

  formatearFecha(fecha?: string | null): string {
    if (!fecha) return 'Fecha no disponible';
    const date = new Date(fecha);
    if (Number.isNaN(date.getTime())) {
      return fecha;
    }
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

}
