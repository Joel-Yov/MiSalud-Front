import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PacienteRequest, PacienteResponse } from '../../core/models/api-models';

@Injectable({ providedIn: 'root' })
export class PacienteService {
  private readonly basePath = '/api/v1/pacientes';

  constructor(private http: HttpClient) {}

  listar(): Observable<PacienteResponse[]> {
    return this.http.get<PacienteResponse[]>(this.basePath);
  }

  obtener(id: number): Observable<PacienteResponse> {
    return this.http.get<PacienteResponse>(`${this.basePath}/${id}`);
  }

  crear(body: PacienteRequest): Observable<PacienteResponse> {
    return this.http.post<PacienteResponse>(this.basePath, body);
  }

  actualizar(id: number, body: PacienteRequest): Observable<PacienteResponse> {
    return this.http.put<PacienteResponse>(`${this.basePath}/${id}`, body);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.basePath}/${id}`);
  }
}
