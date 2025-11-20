import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Hospital, HospitalResponse } from '../../core/models/api-models';

@Injectable({ providedIn: 'root' })
export class HospitalService {
  private readonly basePath = '/api/hospitales';

  constructor(private http: HttpClient) {}

  listar(): Observable<Hospital[] | any> {
    return this.http.get<Hospital[] | any>(this.basePath);
  }

  obtener(id: number): Observable<Hospital | any> {
    return this.http.get<Hospital | any>(`${this.basePath}/${id}`);
  }

  crear(body: Hospital): Observable<HospitalResponse | any> {
    return this.http.post<HospitalResponse | any>(this.basePath, body);
  }

  actualizar(id: number, body: Hospital): Observable<HospitalResponse | any> {
    return this.http.put<HospitalResponse | any>(`${this.basePath}/${id}`, body);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete<any>(`${this.basePath}/${id}`);
  }

  buscarPorNombre(nombre: string): Observable<Hospital[] | any> {
    const params = new HttpParams().set('nombre', nombre);
    return this.http.get<Hospital[] | any>(`${this.basePath}/search`, { params });
  }
}
