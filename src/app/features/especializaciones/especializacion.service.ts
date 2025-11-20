import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Especializacion, DeleteResponse } from '../../core/models/api-models';

@Injectable({ providedIn: 'root' })
export class EspecializacionService {
  private readonly basePath = '/api/especializaciones';

  constructor(private http: HttpClient) {}

  listar(): Observable<Especializacion[]> {
    return this.http.get<Especializacion[]>(this.basePath);
  }

  obtener(id: number): Observable<Especializacion> {
    return this.http.get<Especializacion>(`${this.basePath}/${id}`);
  }

  crear(body: Especializacion): Observable<any> {
    return this.http.post<any>(this.basePath, body);
  }

  actualizar(id: number, body: Especializacion): Observable<any> {
    return this.http.put<any>(`${this.basePath}/${id}`, body);
  }

  eliminar(id: number): Observable<DeleteResponse> {
    return this.http.delete<DeleteResponse>(`${this.basePath}/${id}`);
  }
}
