import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map } from 'rxjs';
import { DoctorRequest, DoctorUpdateRequest, DoctorResponse } from '../../core/models/api-models';

export interface DoctorCard {
  doctorId: number;
  nombre: string;
  especialidadPrincipal: string;
  especialidades: string[];
  foto: string;
  numeroColegiatura?: string | null;
  numeroDocumento?: string | null;
  tipoDocumento?: string | null;
  numeroTelefono?: string | null;
  genero?: string | null;
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
    const especialidades: string[] = doctor.especialidades ?? (doctor.especialidadIds ?? []).map((id: unknown) => String(id));
    return {
      doctorId: doctor.id,
      nombre: nombreCompleto,
      especialidadPrincipal: especialidades[0] || 'Especialidad no disponible',
      especialidades,
      foto: doctor.persona.urlFotoPerfil || 'https://via.placeholder.com/200',
      numeroColegiatura: doctor.numeroColegiatura || null,
      numeroDocumento: doctor.persona.numeroDocumento || null,
      tipoDocumento: doctor.persona.tipoDocumento || null,
      numeroTelefono: doctor.persona.numeroTelefono || null,
      genero: doctor.persona.genero || null
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
