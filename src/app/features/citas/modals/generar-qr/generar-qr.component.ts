import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalController } from '@ionic/angular';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close, medical, bookmarkOutline, calendarOutline, timeOutline, personOutline, medicalOutline, fitnessOutline, locationOutline, documentTextOutline, checkmarkCircleOutline, downloadOutline, shareOutline, qrCodeOutline } from 'ionicons/icons';
import { CitaCard } from '../../citas.component';
import { EstadoCita, TipoAtencion } from '../../../../core/models/api-models';

@Component({
  selector: 'app-generar-qr',
  templateUrl: './generar-qr.component.html',
  styleUrls: ['./generar-qr.component.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon],
})
export class GenerarQrComponent implements OnInit {
  @Input() cita: CitaCard | null = null;
  @ViewChild('ticketRef') ticketRef?: ElementRef<HTMLDivElement>;
  
  qrCode: string = '';
  qrCodeUrl: string = '';
  ticketNumber: string = '';
  fechaGeneracion: string = '';

  constructor(private modalController: ModalController) {
    addIcons({
      close,
      medical,
      bookmarkOutline,
      calendarOutline,
      timeOutline,
      personOutline,
      medicalOutline,
      fitnessOutline,
      locationOutline,
      documentTextOutline,
      checkmarkCircleOutline,
      downloadOutline,
      shareOutline,
      qrCodeOutline
    });
  }

  ngOnInit() {
    this.generarDatosTicket();
  }

  generarDatosTicket() {
    this.ticketNumber = this.generarTicketNumber();
    this.fechaGeneracion = this.obtenerFechaGeneracion();

    const citaId = this.cita?.id ?? 'SIN-ID';
    const codigoQr = `CITA-${citaId}-${this.ticketNumber}`;
    this.qrCode = codigoQr;
    this.qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(codigoQr)}`;
  }

  private generarTicketNumber(): string {
    const numero = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    return numero;
  }

  private obtenerFechaGeneracion(): string {
    return new Date().toLocaleDateString('es-ES', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }

  obtenerEstadoLegible(estado?: EstadoCita | null): string {
    const mapa: Record<string, string> = {
      PENDIENTE: 'Pendiente',
      CONFIRMADA: 'Confirmada',
      CANCELADA: 'Cancelada',
      COMPLETADA: 'Completada',
      NO_ASISTIO: 'No asistió'
    };

    if (!estado) {
      return 'Estado no disponible';
    }

    return mapa[estado] || estado;
  }

  obtenerTipoAtencionLegible(tipo?: TipoAtencion | null): string {
    const mapa: Record<string, string> = {
      PRESENCIAL: 'Presencial',
      TELECONSULTA: 'Teleconsulta',
      DOMICILIARIA: 'Domiciliaria'
    };

    if (!tipo) {
      return 'Tipo de atención no disponible';
    }

    return mapa[tipo] || tipo;
  }

  formatearDuracion(minutos?: number | null): string {
    if (minutos === null || minutos === undefined) {
      return 'Duración no disponible';
    }
    return `${minutos} min`;
  }

  formatearMoneda(valor?: number | null): string {
    if (valor === null || valor === undefined) {
      return 'No disponible';
    }

    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2
    }).format(valor);
  }

  async cerrarModal() {
    await this.modalController.dismiss();
  }

  descargarTicket() {
    const ticket = this.ticketRef?.nativeElement;
    if (!ticket) {
      console.warn('Ticket no disponible para impresión');
      return;
    }

    this.inyectarEstilosImpresion();

    const imprimir = () => {
      setTimeout(() => window.print(), 50);
    };

    if (this.qrCodeUrl) {
      const img = new Image();
      img.onload = () => imprimir();
      img.onerror = () => imprimir();
      img.src = this.qrCodeUrl;
    } else {
      imprimir();
    }
  }

  private inyectarEstilosImpresion() {
    const styleId = 'ticket-print-styles';
    if (document.getElementById(styleId)) {
      return;
    }

      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @page {
          size: 80mm auto;
          margin: 0;
        }
        @media print {
          body { margin: 0; padding: 0; background: #fff !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          body * { visibility: hidden; }
          #ticketPrint.ticket-printable, #ticketPrint.ticket-printable * { visibility: visible; }
          #ticketPrint.ticket-printable {
            position: fixed;
            inset: 0;
            margin: 0 auto;
            width: 80mm !important;
            max-width: 80mm !important;
            padding: 10px 12px 12px !important;
            box-shadow: none !important;
            background: #fff !important;
            color: #000 !important;
            border-radius: 0 !important;
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 12px;
          }
          .ticket-meta { grid-template-columns: 1fr !important; gap: 4px !important; margin-bottom: 6px !important; }
          .meta-block { padding: 6px !important; border-radius: 4px !important; background: #fff !important; border: 1px dashed #ccc !important; }
          .meta-label { font-size: 10px !important; color: #444 !important; }
          .meta-value { font-size: 12px !important; color: #000 !important; }
          #ticketPrint.ticket-printable::before, #ticketPrint.ticket-printable::after { display: none !important; }
          .ticket-info { gap: 4px !important; }
          .info-row { padding: 6px !important; border-radius: 4px !important; background: #fff !important; border: 1px dashed #ccc !important; gap: 6px !important; }
          .info-row.two-cols { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 4px !important; }
          .info-inline { gap: 6px !important; }
          .info-label { font-size: 10px !important; color: #444 !important; }
          .info-value { font-size: 12px !important; color: #000 !important; }
          .qr-container { padding: 8px !important; background: #fff !important; box-shadow: none !important; border: 1px dashed #ccc !important; }
          .qr-image, .qr-fallback { width: 140px !important; height: 140px !important; }
          .action-buttons, ion-header, ion-toolbar, ion-button.close-btn { display: none !important; }
          .modal-content { --background: #fff !important; }
          .info-icon { color: #000 !important; }
          .instructions { background: #fff !important; border: 1px dashed #ccc !important; color: #000 !important; padding: 6px !important; }
          .instructions-title { color: #000 !important; margin-bottom: 4px !important; font-size: 12px !important; }
          .status-chip { background: #eee !important; color: #000 !important; }
        }
      `;
    document.head.appendChild(style);
  }

  compartirTicket() {
    console.log('Compartiendo ticket...', this.ticketNumber);
    // Aquí implementarías la lógica de compartir
  }

}
