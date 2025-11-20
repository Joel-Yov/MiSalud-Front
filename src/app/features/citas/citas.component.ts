import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalController } from '@ionic/angular';
import { HeaderComponent } from "../../shared/header/header.component";
import { FooterComponent } from "../../shared/footer/footer.component";
import { IonContent, IonButton, IonIcon, IonBadge, IonSpinner } from "@ionic/angular/standalone";
import { GenerarQrComponent } from './modals/generar-qr/generar-qr.component';

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

  constructor(private modalController: ModalController) { }

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
