import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorService, DoctorCard } from './doctor.service';
import { IonSpinner, IonIcon, IonSearchbar, IonButton, IonContent } from "@ionic/angular/standalone";
import { FooterComponent } from "../../shared/footer/footer.component";
import { HeaderComponent } from "../../shared/header/header.component";

@Component({
  selector: 'app-doctores',
  templateUrl: './doctores.component.html',
  styleUrls: ['./doctores.component.scss'],
  standalone: true,
  imports: [CommonModule, IonSpinner, IonIcon, FooterComponent, HeaderComponent, IonSearchbar, IonButton, IonContent],
})
export class DoctoresComponent implements OnInit {
  doctores: DoctorCard[] = [];
  loading = false;

  constructor(private doctorService: DoctorService) { }

  ngOnInit() {
    this.cargarDoctores();
  }

  cargarDoctores() {
    this.loading = true;
    this.doctorService.obtenerDoctoresEstaticos().subscribe({
      next: (doctores) => {
        this.doctores = doctores;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar doctores:', error);
        this.loading = false;
      }
    });
  }

  agendarCita(doctor: DoctorCard) {
    console.log('Agendar cita con:', doctor.nombre);
    // Aquí implementarías la lógica para agendar cita
  }

}
