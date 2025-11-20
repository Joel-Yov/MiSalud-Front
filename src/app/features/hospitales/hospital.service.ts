import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HospitalRequest, HospitalResponse } from '../../core/models/api-models';

@Injectable({ providedIn: 'root' })
export class HospitalService {
  private readonly basePath = '/api/v1/hospitales';

  constructor(private http: HttpClient) {}

  listar(): Observable<HospitalResponse[]> {
    return this.http.get<HospitalResponse[]>(this.basePath);
  }

  obtener(id: number): Observable<HospitalResponse> {
    return this.http.get<HospitalResponse>(`${this.basePath}/${id}`);
  }

  crear(body: HospitalRequest): Observable<HospitalResponse> {
    return this.http.post<HospitalResponse>(this.basePath, body);
  }

  actualizar(id: number, body: HospitalRequest): Observable<HospitalResponse> {
    return this.http.put<HospitalResponse>(`${this.basePath}/${id}`, body);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.basePath}/${id}`);
  }
}
