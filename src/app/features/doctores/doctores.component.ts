import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorService, DoctorCard } from './doctor.service';
import { IonSpinner, IonIcon, IonSearchbar, IonButton, IonContent, ModalController, AlertController } from "@ionic/angular/standalone";
import { FooterComponent } from "../../shared/footer/footer.component";
import { HeaderComponent } from "../../shared/header/header.component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faHospitalUser, faStars, faHospital, faClockDesk, faUserDoctor, faCalendar, faFilePen, faTrash } from '@fortawesome/pro-solid-svg-icons';
import { CrearDoctorComponent } from './modals/crear-doctor/crear-doctor.component';
import { EditarDoctorComponent } from './modals/editar-doctor/editar-doctor.component';
import { AuthService } from '../../core/auth/auth.service';

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
    private modalController: ModalController,
    private alertController: AlertController,
    private authService: AuthService
  ) {
    // Agregar iconos de FontAwesome a la librería
    library.addIcons(faHospitalUser, faStars, faHospital, faClockDesk, faUserDoctor, faCalendar, faFilePen, faTrash);
  }

  // Getter para verificar si el usuario tiene rol OPERACIONES
  get esRolOperaciones(): boolean {
    const user = this.authService.currentUser();
    return user?.rol === 'OPERACIONES';
  }

  ngOnInit() {
    this.cargarDoctores();
  }

  cargarDoctores() {
    this.loading = true;
    this.doctorService.listarDoctorCards().subscribe({
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

  async abrirEditarDoctorModal(doctorId: number) {
    const modal = await this.modalController.create({
      component: EditarDoctorComponent,
      componentProps: {
        doctorId: doctorId
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data && data.doctorActualizado) {
      this.cargarDoctores();
    }
  }

  async eliminarDoctor(doctorId: number) {
    const alert = await this.alertController.create({
      header: '¿Eliminar Doctor?',
      message: '¿Estás seguro de que deseas eliminar este doctor? Esta acción no se puede deshacer.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.confirmarEliminacion(doctorId);
          }
        }
      ]
    });

    await alert.present();
  }

  confirmarEliminacion(doctorId: number) {
    this.doctorService.eliminar(doctorId).subscribe({
      next: () => {
        console.log('Doctor eliminado exitosamente');
        this.cargarDoctores();
      },
      error: (error) => {
        console.error('Error al eliminar doctor:', error);
        this.mostrarErrorEliminacion();
      }
    });
  }

  async mostrarErrorEliminacion() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'No se pudo eliminar el doctor. Por favor, intenta nuevamente.',
      buttons: ['OK']
    });

    await alert.present();
  }
}
