import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SedeHospitalRequest, SedeHospitalResponse } from '../../core/models/api-models';

@Injectable({ providedIn: 'root' })
export class SedeHospitalService {
  private readonly basePath = '/api/v1/sedes';

  constructor(private http: HttpClient) {}

  listar(): Observable<SedeHospitalResponse[]> {
    return this.http.get<SedeHospitalResponse[]>(this.basePath);
  }

  obtener(id: number): Observable<SedeHospitalResponse> {
    return this.http.get<SedeHospitalResponse>(`${this.basePath}/${id}`);
  }

  listarPorHospital(hospitalId: number): Observable<SedeHospitalResponse[]> {
    return this.http.get<SedeHospitalResponse[]>(`${this.basePath}/hospital/${hospitalId}`);
  }

  crear(body: SedeHospitalRequest): Observable<SedeHospitalResponse> {
    return this.http.post<SedeHospitalResponse>(this.basePath, body);
  }

  actualizar(id: number, body: SedeHospitalRequest): Observable<SedeHospitalResponse> {
    return this.http.put<SedeHospitalResponse>(`${this.basePath}/${id}`, body);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.basePath}/${id}`);
  }
}
