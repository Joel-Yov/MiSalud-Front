import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DoctorService, DoctorCard } from './doctor.service';
import { IonSpinner, IonIcon, IonSearchbar, IonButton, IonContent, ModalController, AlertController } from "@ionic/angular/standalone";
import { FooterComponent } from "../../shared/footer/footer.component";
import { HeaderComponent } from "../../shared/header/header.component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faHospitalUser, faUserDoctor, faCalendar, faFilePen, faTrash, faPhone, faUser } from '@fortawesome/pro-solid-svg-icons';
import { CrearDoctorComponent } from './modals/crear-doctor/crear-doctor.component';
import { EditarDoctorComponent } from './modals/editar-doctor/editar-doctor.component';
import { AuthService } from '../../core/auth/auth.service';
import { CrearCitaComponent } from '../citas/modals/crear-cita/crear-cita.component';

@Component({
  selector: 'app-doctores',
  templateUrl: './doctores.component.html',
  styleUrls: ['./doctores.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonSpinner, IonIcon, FooterComponent, HeaderComponent, IonSearchbar, IonButton, IonContent, FontAwesomeModule],
})
export class DoctoresComponent implements OnInit {
  doctores: DoctorCard[] = [];
  loading = false;
  readonly fallbackFoto = 'https://via.placeholder.com/200?text=Doctor';
  filtroTexto = '';

  constructor(
    private doctorService: DoctorService, 
    private library: FaIconLibrary,
    private modalController: ModalController,
    private alertController: AlertController,
    private authService: AuthService
  ) {
    // Agregar iconos de FontAwesome a la librería
    library.addIcons(faHospitalUser, faUserDoctor, faCalendar, faFilePen, faTrash, faPhone, faUser);
  }

  // VALIDACIONES PARA MOSTRAR O NO FLUJOS ACORDE A LOS ROLES
  get esRolOperaciones(): boolean {
    const user = this.authService.currentUser();
    return user?.rol === 'OPERACIONES';
  }

  get esRolPaciente(): boolean {
    const user = this.authService.currentUser();
    return user?.rol === 'PACIENTE';
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

  async agendarCita(doctorId: number) {
    const modal = await this.modalController.create({
      component: CrearCitaComponent,
      componentProps: {
        doctorId: doctorId
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data && data.citaCreada) {
      console.log('Cita creada exitosamente');
    }
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

  get doctoresFiltrados(): DoctorCard[] {
    const termino = this.filtroTexto.trim().toLowerCase();
    if (!termino) return this.doctores;
    return this.doctores.filter((doctor) => {
      const campos = [
        doctor.nombre,
        doctor.especialidadPrincipal,
        ...(doctor.especialidades || []),
        doctor.numeroColegiatura || '',
        doctor.numeroDocumento || ''
      ];
      return campos.some((campo) => campo?.toLowerCase().includes(termino));
    });
  }

  confirmarEliminacion(doctorId: number) {
    this.doctorService.eliminar(doctorId).subscribe({
      next: () => {
        console.log('Doctor eliminado exitosamente');
        window.location.reload();
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

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = this.fallbackFoto;
  }
}
