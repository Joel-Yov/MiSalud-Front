import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Paciente } from '../../core/models/api-models';

@Injectable({ providedIn: 'root' })
export class PacienteService {
  private readonly basePath = '/api/pacientes';

  constructor(private http: HttpClient) {}

  listar(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(this.basePath);
  }

  obtener(id: number): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.basePath}/${id}`);
  }

  crear(body: Paciente): Observable<Paciente> {
    return this.http.post<Paciente>(this.basePath, body);
  }

  actualizar(id: number, body: Paciente): Observable<Paciente> {
    return this.http.put<Paciente>(`${this.basePath}/${id}`, body);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.basePath}/${id}`);
  }
}
