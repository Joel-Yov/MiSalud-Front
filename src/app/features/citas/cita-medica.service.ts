import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CitaMedica } from '../../core/models/api-models';

@Injectable({ providedIn: 'root' })
export class CitaMedicaService {
  private readonly basePath = '/api/citas';

  constructor(private http: HttpClient) {}

  listar(): Observable<CitaMedica[]> {
    return this.http.get<CitaMedica[]>(this.basePath);
  }

  obtener(id: number): Observable<CitaMedica> {
    return this.http.get<CitaMedica>(`${this.basePath}/${id}`);
  }

  listarPorDoctor(doctorId: number): Observable<CitaMedica[]> {
    return this.http.get<CitaMedica[]>(`${this.basePath}/doctor/${doctorId}`);
  }

  listarPorPaciente(pacienteId: number): Observable<CitaMedica[]> {
    return this.http.get<CitaMedica[]>(`${this.basePath}/paciente/${pacienteId}`);
  }

  listarPorRango(inicioIso: string, finIso: string): Observable<CitaMedica[]> {
    const params = new HttpParams().set('inicio', inicioIso).set('fin', finIso);
    return this.http.get<CitaMedica[]>(`${this.basePath}/rango`, { params });
  }

  crear(body: CitaMedica): Observable<CitaMedica> {
    return this.http.post<CitaMedica>(this.basePath, body);
  }

  actualizar(id: number, body: CitaMedica): Observable<CitaMedica> {
    return this.http.put<CitaMedica>(`${this.basePath}/${id}`, body);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.basePath}/${id}`);
  }
}
