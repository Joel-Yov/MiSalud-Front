import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DoctorRequest, DoctorResponse } from '../../core/models/api-models';

@Injectable({ providedIn: 'root' })
export class DoctorService {
  private readonly basePath = '/api/v1/doctores';

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
}
