import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CitaMedicaRequest, CitaMedicaResponse } from '../../core/models/api-models';

@Injectable({ providedIn: 'root' })
export class CitaMedicaService {
  private readonly basePath = '/api/v1/citas';

  constructor(private http: HttpClient) {}

  listar(): Observable<CitaMedicaResponse[]> {
    return this.http.get<CitaMedicaResponse[]>(this.basePath);
  }

  obtener(id: number): Observable<CitaMedicaResponse> {
    return this.http.get<CitaMedicaResponse>(`${this.basePath}/${id}`);
  }

  listarPorDoctor(doctorId: number): Observable<CitaMedicaResponse[]> {
    return this.http.get<CitaMedicaResponse[]>(`${this.basePath}/doctor/${doctorId}`);
  }

  listarPorPaciente(pacienteId: number): Observable<CitaMedicaResponse[]> {
    return this.http.get<CitaMedicaResponse[]>(`${this.basePath}/paciente/${pacienteId}`);
  }

  listarPorRango(inicioIso: string, finIso: string): Observable<CitaMedicaResponse[]> {
    const params = new HttpParams().set('inicio', inicioIso).set('fin', finIso);
    return this.http.get<CitaMedicaResponse[]>(`${this.basePath}/rango`, { params });
  }

  crear(body: CitaMedicaRequest): Observable<CitaMedicaResponse> {
    return this.http.post<CitaMedicaResponse>(this.basePath, body);
  }

  actualizar(id: number, body: CitaMedicaRequest): Observable<CitaMedicaResponse> {
    return this.http.put<CitaMedicaResponse>(`${this.basePath}/${id}`, body);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.basePath}/${id}`);
  }
}
