import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalController } from '@ionic/angular';
import { HeaderComponent } from "../../shared/header/header.component";
import { FooterComponent } from "../../shared/footer/footer.component";
import { IonContent, IonButton, IonIcon, IonBadge, IonSpinner } from "@ionic/angular/standalone";
import { GenerarQrComponent } from './modals/generar-qr/generar-qr.component';
import { addIcons } from 'ionicons';
import { timeOutline, personOutline, medicalOutline, locationOutline, qrCodeOutline, calendarOutline, addCircleOutline, createOutline, trashOutline, ellipsisVertical } from 'ionicons/icons';

export interface CitaCard {
  citaId: number;
  hora: string;
  fechaCompleta: string;
  paciente: {
    nombre: string;
    documento: string;
  };
  doctor: {
    nombre: string;
    especialidad: string;
  };
  consultorio: string;
  piso: string;
  motivo: string;
  estado: 'programada' | 'confirmada' | 'cancelada' | 'completada';
  confirmadoPor: string;
  tipoConfirmacion: string;
}

@Component({
  selector: 'app-citas',
  templateUrl: './citas.component.html',
  styleUrls: ['./citas.component.scss'],
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, IonContent, IonButton, IonIcon, IonBadge, IonSpinner],
  providers: [ModalController]
})
export class CitasComponent implements OnInit {
  citas: CitaCard[] = [];
  loading = false;

  private citasEstaticas: CitaCard[] = [
    {
      citaId: 1,
      hora: '09:00',
      fechaCompleta: '10:00',
      paciente: {
        nombre: 'Juan Pérez García',
        documento: 'Doc: 12345678'
      },
      doctor: {
        nombre: 'Dra. María González López',
        especialidad: 'Medicina General'
      },
      consultorio: 'Consultorio 101',
      piso: 'Piso 1',
      motivo: 'Control médico rutinario',
      estado: 'confirmada',
      confirmadoPor: 'Recepcionista Ana',
      tipoConfirmacion: 'TELÉFONO'
    },
    {
      citaId: 2,
      hora: '11:30',
      fechaCompleta: '12:00',
      paciente: {
        nombre: 'Ana Martínez Silva',
        documento: 'Doc: 87654321'
      },
      doctor: {
        nombre: 'Dr. Carlos Rodríguez Silva',
        especialidad: 'Cardiología'
      },
      consultorio: 'Consultorio 205',
      piso: 'Piso 2',
      motivo: 'Revisión cardiológica',
      estado: 'programada',
      confirmadoPor: 'Pendiente confirmación',
      tipoConfirmacion: 'EMAIL'
    },
    {
      citaId: 3,
      hora: '14:15',
      fechaCompleta: '14:45',
      paciente: {
        nombre: 'Luis Roberto Vega',
        documento: 'Doc: 11223344'
      },
      doctor: {
        nombre: 'Dra. Patricia López Herrera',
        especialidad: 'Dermatología'
      },
      consultorio: 'Consultorio 301',
      piso: 'Piso 3',
      motivo: 'Consulta dermatológica',
      estado: 'confirmada',
      confirmadoPor: 'Recepcionista Carlos',
      tipoConfirmacion: 'PRESENCIAL'
    },
    {
      citaId: 4,
      hora: '16:00',
      fechaCompleta: '16:30',
      paciente: {
        nombre: 'Carmen Ruiz Morales',
        documento: 'Doc: 55667788'
      },
      doctor: {
        nombre: 'Dr. Roberto Silva Vega',
        especialidad: 'Traumatología'
      },
      consultorio: 'Consultorio 105',
      piso: 'Piso 1',
      motivo: 'Control post-operatorio',
      estado: 'programada',
      confirmadoPor: 'Pendiente confirmación',
      tipoConfirmacion: 'SMS'
    }
  ];

  constructor(private modalController: ModalController) {
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
  }

  ngOnInit() {
    this.cargarCitas();
  }

  cargarCitas() {
    this.loading = true;
    // Simular carga de datos
    setTimeout(() => {
      this.citas = this.citasEstaticas;
      this.loading = false;
    }, 1000);
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

  async abrirCrearCitaModal() {
    const { CrearCitaComponent } = await import('./modals/crear-cita/crear-cita.component');
    
    const modal = await this.modalController.create({
      component: CrearCitaComponent,
      componentProps: {
        modoEdicion: false
      },
      cssClass: 'cita-modal',
      backdropDismiss: false
    });
    
    await modal.present();
    
    const { data } = await modal.onWillDismiss();
    if (data && data.accion === 'crear') {
      console.log('Nueva cita creada:', data.datos);
      // Aquí añadirías la nueva cita a la lista
      this.agregarNuevaCita(data.datos);
    }
  }

  async abrirEditarCitaModal(cita: CitaCard) {
    const { CrearCitaComponent } = await import('./modals/crear-cita/crear-cita.component');
    
    const modal = await this.modalController.create({
      component: CrearCitaComponent,
      componentProps: {
        modoEdicion: true,
        citaParaEditar: cita
      },
      cssClass: 'cita-modal',
      backdropDismiss: false
    });
    
    await modal.present();
    
    const { data } = await modal.onWillDismiss();
    if (data && data.accion === 'editar') {
      console.log('Cita editada:', data.datos);
      // Aquí actualizarías la cita en la lista
      this.actualizarCita(data.datos);
    }
  }

  eliminarCita(citaId: number) {
    // Simular eliminación
    console.log('Eliminando cita:', citaId);
    this.citas = this.citas.filter(cita => cita.citaId !== citaId);
  }

  private agregarNuevaCita(nuevaCita: any) {
    // Simular agregar nueva cita
    const citaCompleta: CitaCard = {
      citaId: nuevaCita.id,
      hora: nuevaCita.hora,
      fechaCompleta: this.formatearFecha(nuevaCita.fecha),
      paciente: nuevaCita.paciente,
      doctor: nuevaCita.doctor,
      consultorio: nuevaCita.consultorio,
      piso: nuevaCita.piso,
      motivo: nuevaCita.motivo,
      estado: 'programada',
      confirmadoPor: 'Pendiente de confirmación',
      tipoConfirmacion: 'app'
    };
    
    this.citas.unshift(citaCompleta);
  }

  private actualizarCita(citaEditada: any) {
    // Simular actualización de cita
    const index = this.citas.findIndex(c => c.citaId === citaEditada.id);
    if (index !== -1) {
      this.citas[index] = {
        ...this.citas[index],
        hora: citaEditada.hora,
        fechaCompleta: this.formatearFecha(citaEditada.fecha),
        paciente: citaEditada.paciente,
        doctor: citaEditada.doctor,
        consultorio: citaEditada.consultorio,
        piso: citaEditada.piso,
        motivo: citaEditada.motivo
      };
    }
  }

  private formatearFecha(fechaISO: string): string {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getEstadoBadgeClass(estado: string): string {
    switch (estado) {
      case 'confirmada': return 'badge-confirmada';
      case 'programada': return 'badge-programada';
      case 'cancelada': return 'badge-cancelada';
      case 'completada': return 'badge-completada';
      default: return 'badge-programada';
    }
  }

  trackByCitaId(index: number, cita: CitaCard): number {
    return cita.citaId;
  }

}
