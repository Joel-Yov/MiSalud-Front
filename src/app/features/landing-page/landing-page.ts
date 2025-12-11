import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FooterComponent } from "../../shared/footer/footer.component";
import { HeaderComponent } from "../../shared/header/header.component";
import { IonContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  personOutline, 
  personAddOutline, 
  peopleOutline, 
  timeOutline, 
  heartOutline, 
  eyeOutline, 
  businessOutline,
  callOutline,
  mailOutline,
  locationOutline,
  chatbubbleOutline,
  warningOutline,
  medicalOutline,
  pulseOutline,
  happyOutline,
  fitnessOutline,
  eyeOffOutline,
  skullOutline,
  leafOutline,
  thermometerOutline,
  bodyOutline,
  colorPaletteOutline,
  bandageOutline,
  constructOutline
} from 'ionicons/icons';

export interface Especialidad {
  id: number;
  nombre: string;
  descripcion: string;
  icono: string;
  doctores: number;
  horario: string;
}

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterLink, FooterComponent, HeaderComponent, IonContent, IonButton, IonIcon],
  templateUrl: './landing-page.html',
  styleUrls: ['./landing-page.scss'],
})
export class LandingPage implements OnInit {
  
  especialidades: Especialidad[] = [
    {
      id: 1,
      nombre: 'Cardiología',
      descripcion: 'Especialistas en enfermedades del corazón y sistema cardiovascular.',
      icono: 'heart-outline',
      doctores: 8,
      horario: '24/7'
    },
    {
      id: 2,
      nombre: 'Neurología',
      descripcion: 'Diagnóstico y tratamiento de trastornos del sistema nervioso.',
      icono: 'pulse-outline',
      doctores: 6,
      horario: 'L-V 8AM-6PM'
    },
    {
      id: 3,
      nombre: 'Pediatría',
      descripcion: 'Atención médica especializada para bebés, niños y adolescentes.',
      icono: 'happy-outline',
      doctores: 10,
      horario: '24/7'
    },
    {
      id: 4,
      nombre: 'Ginecología',
      descripcion: 'Cuidado integral de la salud femenina y reproductiva.',
      icono: 'body-outline',
      doctores: 7,
      horario: 'L-S 7AM-7PM'
    },
    {
      id: 5,
      nombre: 'Traumatología',
      descripcion: 'Tratamiento de lesiones del sistema músculo-esquelético.',
      icono: 'bandage-outline',
      doctores: 9,
      horario: '24/7'
    },
    {
      id: 6,
      nombre: 'Dermatología',
      descripcion: 'Especialistas en enfermedades de la piel, cabello y uñas.',
      icono: 'color-palette-outline',
      doctores: 4,
      horario: 'L-V 8AM-5PM'
    },
    {
      id: 7,
      nombre: 'Oftalmología',
      descripcion: 'Diagnóstico y tratamiento de enfermedades oculares.',
      icono: 'eye-outline',
      doctores: 5,
      horario: 'L-V 7AM-6PM'
    },
    {
      id: 8,
      nombre: 'Medicina Interna',
      descripcion: 'Atención integral de adultos con enfermedades complejas.',
      icono: 'medical-outline',
      doctores: 12,
      horario: '24/7'
    },
    {
      id: 9,
      nombre: 'Endocrinología',
      descripcion: 'Especialistas en trastornos hormonales y metabólicos.',
      icono: 'thermometer-outline',
      doctores: 3,
      horario: 'L-V 8AM-4PM'
    },
    {
      id: 10,
      nombre: 'Psiquiatría',
      descripcion: 'Tratamiento de trastornos mentales y emocionales.',
      icono: 'fitness-outline',
      doctores: 6,
      horario: 'L-S 9AM-6PM'
    },
    {
      id: 11,
      nombre: 'Oncología',
      descripcion: 'Diagnóstico y tratamiento especializado del cáncer.',
      icono: 'skull-outline',
      doctores: 4,
      horario: 'L-V 8AM-5PM'
    },
    {
      id: 12,
      nombre: 'Medicina Natural',
      descripcion: 'Tratamientos alternativos y medicina complementaria.',
      icono: 'leaf-outline',
      doctores: 2,
      horario: 'L-V 9AM-4PM'
    }
  ];

  constructor() {
    addIcons({
      personOutline,
      personAddOutline,
      peopleOutline,
      timeOutline,
      heartOutline,
      eyeOutline,
      businessOutline,
      callOutline,
      mailOutline,
      locationOutline,
      chatbubbleOutline,
      warningOutline,
      medicalOutline,
      pulseOutline,
      happyOutline,
      fitnessOutline,
      eyeOffOutline,
      skullOutline,
      leafOutline,
      thermometerOutline,
      bodyOutline,
      colorPaletteOutline,
      bandageOutline,
      constructOutline
    });
  }

  ngOnInit() {
    console.log('Landing Page inicializada con', this.especialidades.length, 'especialidades');
  }

  trackByEspecialidad(index: number, especialidad: Especialidad): number {
    return especialidad.id;
  }
}
