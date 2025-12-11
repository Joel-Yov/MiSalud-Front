import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CitaRequest, CitaResponse, CitaMedicaRequest, CitaMedicaResponse } from '../../core/models/api-models';

@Injectable({ providedIn: 'root' })
export class CitaMedicaService {
  private readonly basePath = '/api/v1/citas';

  constructor(private http: HttpClient) {}

  listar(): Observable<CitaResponse[]> {
    return this.http.get<CitaResponse[]>(this.basePath);
  }

  obtener(id: number): Observable<CitaResponse> {
    return this.http.get<CitaResponse>(`${this.basePath}/${id}`);
  }

  listarPorDoctor(doctorId: number): Observable<CitaResponse[]> {
    return this.http.get<CitaResponse[]>(`${this.basePath}/doctor/${doctorId}`);
  }

  listarPorPaciente(pacienteId: number): Observable<CitaResponse[]> {
    return this.http.get<CitaResponse[]>(`${this.basePath}/paciente/${pacienteId}`);
  }

  listarPorRango(inicioIso: string, finIso: string): Observable<CitaResponse[]> {
    const params = new HttpParams().set('inicio', inicioIso).set('fin', finIso);
    return this.http.get<CitaResponse[]>(`${this.basePath}/rango`, { params });
  }

  crear(body: CitaRequest): Observable<CitaResponse> {
    return this.http.post<CitaResponse>(this.basePath, body);
  }

  actualizar(id: number, body: CitaRequest): Observable<CitaResponse> {
    return this.http.put<CitaResponse>(`${this.basePath}/${id}`, body);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.basePath}/${id}`);
  }
}