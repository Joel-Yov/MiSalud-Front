import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorService, DoctorCard } from './doctor.service';
import { IonSpinner, IonIcon, IonSearchbar, IonButton, IonContent, ModalController } from "@ionic/angular/standalone";
import { FooterComponent } from "../../shared/footer/footer.component";
import { HeaderComponent } from "../../shared/header/header.component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faHospitalUser, faStars, faHospital, faClockDesk, faUserDoctor, faCalendar } from '@fortawesome/pro-solid-svg-icons';
import { CrearDoctorComponent } from './modals/crear-doctor/crear-doctor.component';

@Component({
  selector: 'app-doctores',
  templateUrl: './doctores.component.html',
  styleUrls: ['./doctores.component.scss'],
  standalone: true,
  imports: [CommonModule, IonSpinner, IonIcon, FooterComponent, HeaderComponent, IonSearchbar, IonButton, IonContent, FontAwesomeModule],
})
export class DoctoresComponent implements OnInit {
  doctores: DoctorCard[] = [];
  loading = false;

  constructor(
    private doctorService: DoctorService, 
    private library: FaIconLibrary,
    private modalController: ModalController
  ) {
    // Agregar iconos de FontAwesome a la librería
    library.addIcons(faHospitalUser, faStars, faHospital, faClockDesk, faUserDoctor, faCalendar);
  }

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

  async abrirModalCrearDoctor(){
    const modal = await this.modalController.create({
      component: CrearDoctorComponent
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data && data.doctorCreado) {
      this.cargarDoctores();
    }
  }
}
