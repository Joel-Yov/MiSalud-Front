import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map } from 'rxjs';
import { DoctorRequest, DoctorUpdateRequest, DoctorResponse } from '../../core/models/api-models';

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
  numeroDocumento: string;
  numeroTelefono: string;
  especialidadIds: number[] | string[];
  numeroColegiatura: string;
}

@Injectable({ providedIn: 'root' })
export class DoctorService {
  private readonly basePath = '/api/v1/doctores';

  // Datos estáticos adicionales
  private doctoresEstaticos: DoctorResponse[] = [];

  constructor(private http: HttpClient) {}

  // Método para transformar DoctorResponse a DoctorCard
  private transformarADoctorCard(doctor: DoctorResponse): DoctorCard {
    const nombreCompleto = `${doctor.persona.primerNombre} ${doctor.persona.segundoNombre || ''} ${doctor.persona.primerApellido} ${doctor.persona.segundoApellido || ''}`.trim();
    
    return {
      doctorId: doctor.id,
      nombre: nombreCompleto,
      especialidad: 'Especialidad ' + doctor.especialidadIds[0], // Temporal, se puede mejorar con un servicio de especialidades
      imagen: doctor.persona.urlFotoPerfil || 'https://via.placeholder.com/200',
      calificacion: 4.5, // Valor por defecto
      experiencia: '5+ años', // Valor por defecto
      consultorio: 'Consultorio ' + doctor.id,
      horarios: ['Lun-Vie 9:00-17:00'], // Valor por defecto, si puedes en el backend trae horarios reales mejor
      certificaciones: doctor.especialidadIds.map(id => `Certificación ${id}`),
      pacientesAtendidos: Math.floor(Math.random() * 1000) + 100, // Valor aleatorio temporal
      numeroDocumento: doctor.persona.numeroDocumento,
      numeroTelefono: doctor.persona.numeroTelefono,
      especialidadIds: doctor.especialidadIds,
      numeroColegiatura: doctor.numeroColegiatura || ''
    };
  }

  listar(): Observable<DoctorResponse[]> {
    return this.http.get<DoctorResponse[]>(this.basePath);
  }

  // Método para listar doctores transformados a DoctorCard
  listarDoctorCards(): Observable<DoctorCard[]> {
    return this.http.get<DoctorResponse[]>(this.basePath).pipe(
      map(doctoresAPI => {
        // Combinar doctores de la API con doctores estáticos
        const todosDoctores = [...doctoresAPI, ...this.doctoresEstaticos];
        return todosDoctores.map(doctor => this.transformarADoctorCard(doctor));
      })
    );
  }

  obtener(id: number): Observable<DoctorResponse> {
    return this.http.get<DoctorResponse>(`${this.basePath}/${id}`);
  }

  crear(body: DoctorRequest): Observable<DoctorResponse> {
    return this.http.post<DoctorResponse>(this.basePath, body);
  }

  actualizar(id: number, body: DoctorUpdateRequest): Observable<DoctorResponse> {
    return this.http.put<DoctorResponse>(`${this.basePath}/${id}`, body);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.basePath}/${id}`);
  }
}
