import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Doctor } from '../../core/models/api-models';

@Injectable({ providedIn: 'root' })
export class DoctorService {
  private readonly basePath = '/api/doctores';

  constructor(private http: HttpClient) {}

  listar(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(this.basePath);
  }

  obtener(id: number): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.basePath}/${id}`);
  }

  crear(body: Doctor): Observable<Doctor> {
    return this.http.post<Doctor>(this.basePath, body);
  }

  actualizar(id: number, body: Doctor): Observable<Doctor> {
    return this.http.put<Doctor>(`${this.basePath}/${id}`, body);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.basePath}/${id}`);
  }
}
