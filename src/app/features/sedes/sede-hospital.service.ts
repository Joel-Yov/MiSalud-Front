import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SedeHospital } from '../../core/models/api-models';

@Injectable({ providedIn: 'root' })
export class SedeHospitalService {
  private readonly basePath = '/api/sedes';

  constructor(private http: HttpClient) {}

  listar(): Observable<SedeHospital[]> {
    return this.http.get<SedeHospital[]>(this.basePath);
  }

  obtener(id: number): Observable<SedeHospital> {
    return this.http.get<SedeHospital>(`${this.basePath}/${id}`);
  }

  listarPorHospital(hospitalId: number): Observable<SedeHospital[]> {
    return this.http.get<SedeHospital[]>(`${this.basePath}/hospital/${hospitalId}`);
  }

  crear(body: SedeHospital): Observable<SedeHospital> {
    return this.http.post<SedeHospital>(this.basePath, body);
  }

  actualizar(id: number, body: SedeHospital): Observable<SedeHospital> {
    return this.http.put<SedeHospital>(`${this.basePath}/${id}`, body);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.basePath}/${id}`);
  }
}
