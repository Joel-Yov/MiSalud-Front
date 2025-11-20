import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { DoctorRequest, DoctorResponse } from '../../core/models/api-models';

export interface DoctorCard {
  doctorId: number;
  nombre: string;
  especialidad: string;
  imagen: string;
  calificacion: number;
  experiencia: string;
  consultorio: string;
  horarios: string[];
  certificaciones: string[];
  pacientesAtendidos: number;
}

@Injectable({ providedIn: 'root' })
export class DoctorService {
  private readonly basePath = '/api/v1/doctores';

  private doctoresEstaticos: DoctorCard[] = [
    {
      doctorId: 1,
      nombre: 'Dr. María González López',
      especialidad: 'Medicina General',
      imagen: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face',
      calificacion: 4.8,
      experiencia: '12+ años',
      consultorio: 'Consultorio 101',
      horarios: ['Lun-Vie 9:00-17:00'],
      certificaciones: ['Medicina General', 'Medicina Preventiva'],
      pacientesAtendidos: 827
    },
    {
      doctorId: 2,
      nombre: 'Dr. Carlos Rodríguez Silva',
      especialidad: 'Cardiología',
      imagen: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face',
      calificacion: 4.9,
      experiencia: '15+ años',
      consultorio: 'Consultorio 102',
      horarios: ['Mar-Sáb 10:00-18:00'],
      certificaciones: ['Cardiología', 'Medicina Interna'],
      pacientesAtendidos: 689
    },
    {
      doctorId: 3,
      nombre: 'Dr. Luis Moreno Castro',
      especialidad: 'Pediatría',
      imagen: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200&h=200&fit=crop&crop=face',
      calificacion: 4.7,
      experiencia: '10+ años',
      consultorio: 'Consultorio 201',
      horarios: ['Lun-Vie 8:00-16:00'],
      certificaciones: ['Pediatría', 'Neonatología'],
      pacientesAtendidos: 1356
    },
    {
      doctorId: 4,
      nombre: 'Dra. Ana Martínez Ruiz',
      especialidad: 'Ginecología',
      imagen: 'https://images.unsplash.com/photo-1594824475480-1b2b3361ec7a?w=200&h=200&fit=crop&crop=face',
      calificacion: 4.9,
      experiencia: '18+ años',
      consultorio: 'Consultorio 203',
      horarios: ['Lun-Jue 9:00-17:00'],
      certificaciones: ['Ginecología', 'Obstetricia'],
      pacientesAtendidos: 942
    },
    {
      doctorId: 5,
      nombre: 'Dr. Roberto Silva Vega',
      especialidad: 'Traumatología',
      imagen: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop&crop=face',
      calificacion: 4.6,
      experiencia: '14+ años',
      consultorio: 'Consultorio 105',
      horarios: ['Mar-Sáb 8:00-16:00'],
      certificaciones: ['Traumatología', 'Cirugía Ortopédica'],
      pacientesAtendidos: 567
    },
    {
      doctorId: 6,
      nombre: 'Dra. Patricia López Herrera',
      especialidad: 'Dermatología',
      imagen: 'https://images.unsplash.com/photo-1594824475480-1b2b3361ec7a?w=200&h=200&fit=crop&crop=face',
      calificacion: 4.8,
      experiencia: '11+ años',
      consultorio: 'Consultorio 301',
      horarios: ['Lun-Vie 10:00-18:00'],
      certificaciones: ['Dermatología', 'Cirugía Dermatológica'],
      pacientesAtendidos: 734
    }
  ];

  constructor(private http: HttpClient) {}

  listar(): Observable<DoctorResponse[]> {
    return this.http.get<DoctorResponse[]>(this.basePath);
  }

  obtener(id: number): Observable<DoctorResponse> {
    return this.http.get<DoctorResponse>(`${this.basePath}/${id}`);
  }

  crear(body: DoctorRequest): Observable<DoctorResponse> {
    return this.http.post<DoctorResponse>(this.basePath, body);
  }

  actualizar(id: number, body: DoctorRequest): Observable<DoctorResponse> {
    return this.http.put<DoctorResponse>(`${this.basePath}/${id}`, body);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.basePath}/${id}`);
  }

  // Método para obtener doctores estáticos
  obtenerDoctoresEstaticos(): Observable<DoctorCard[]> {
    return of(this.doctoresEstaticos);
  }
}
