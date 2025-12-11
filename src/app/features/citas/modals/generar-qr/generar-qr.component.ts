import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalController } from '@ionic/angular';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close, medical, bookmarkOutline, calendarOutline, timeOutline, personOutline, medicalOutline, fitnessOutline, locationOutline, documentTextOutline, checkmarkCircleOutline, downloadOutline, shareOutline } from 'ionicons/icons';
import { CitaCard } from '../../citas.component';

@Component({
  selector: 'app-generar-qr',
  templateUrl: './generar-qr.component.html',
  styleUrls: ['./generar-qr.component.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon],
})
export class GenerarQrComponent implements OnInit {
  @Input() cita!: CitaCard;
  
  qrCode: string = '';
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
      shareOutline
    });
  }

  ngOnInit() {
    this.generarDatosTicket();
  }

  generarDatosTicket() {
    // Generar número de ticket
    this.ticketNumber = Math.floor(Math.random() * 1000000).toString();
    
    // Fecha actual
    this.fechaGeneracion = new Date().toLocaleDateString('es-ES', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
    
    // Simular datos del QR (en una implementación real, esto vendría del backend)
    this.qrCode = `CITA-${this.cita.citaId}-${this.ticketNumber}`;
  }

  async cerrarModal() {
    await this.modalController.dismiss();
  }

  descargarTicket() {
    console.log('Descargando ticket...', this.ticketNumber);
    // Aquí implementarías la lógica de descarga
  }

  compartirTicket() {
    console.log('Compartiendo ticket...', this.ticketNumber);
    // Aquí implementarías la lógica de compartir
  }

}
