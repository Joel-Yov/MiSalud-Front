import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EspecializacionRequest, EspecializacionResponse } from '../../core/models/api-models';

@Injectable({ providedIn: 'root' })
export class EspecializacionService {
  private readonly basePath = '/api/v1/especializaciones';

  constructor(private http: HttpClient) {}

  listar(): Observable<EspecializacionResponse[]> {
    return this.http.get<EspecializacionResponse[]>(this.basePath);
  }

  obtener(id: number): Observable<EspecializacionResponse> {
    return this.http.get<EspecializacionResponse>(`${this.basePath}/${id}`);
  }

  crear(body: EspecializacionRequest): Observable<EspecializacionResponse> {
    return this.http.post<EspecializacionResponse>(this.basePath, body);
  }

  actualizar(id: number, body: EspecializacionRequest): Observable<EspecializacionResponse> {
    return this.http.put<EspecializacionResponse>(`${this.basePath}/${id}`, body);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.basePath}/${id}`);
  }
}
