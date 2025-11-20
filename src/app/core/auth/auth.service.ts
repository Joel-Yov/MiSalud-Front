import { Injectable, Signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import {
  AuthResponse,
  AuthSession,
  AuthUser,
  LoginRequest,
  MessageResponse,
  RegistroRequest,
} from '../models/api-models';
import { TokenStorageService } from './token-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly basePath = '/api/auth';

  readonly session: Signal<AuthSession | null>;
  readonly isAuthenticated: Signal<boolean>;
  readonly token: Signal<string | null>;
  readonly currentUser: Signal<AuthUser | null>;

  constructor(private readonly tokenStorage: TokenStorageService) {
    this.session = this.tokenStorage.session;
    this.isAuthenticated = this.tokenStorage.isAuthenticated;
    this.token = this.tokenStorage.token;
    this.currentUser = computed(() => {
      const session = this.session();
      if (!session) {
        return null;
      }

      const { token: _token, type: _type, ...user } = session;
      return user;
    });
  }

  login(payload: LoginRequest): Observable<AuthSession> {
    return this.http.post<AuthResponse>(`${this.basePath}/login`, payload).pipe(
      map((response) => this.normalizeResponse(response)),
      tap((session) => this.tokenStorage.setSession(session))
    );
  }

  register(payload: RegistroRequest): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${this.basePath}/register`, payload);
  }

  fetchProfile(): Observable<AuthUser> {
    return this.http.get<AuthUser>(`${this.basePath}/me`).pipe(
      tap((user) => {
        const session = this.session();
        if (session) {
          this.tokenStorage.setSession({ ...session, ...user });
        }
      })
    );
  }

  logout(): void {
    this.tokenStorage.clear();
  }

  private normalizeResponse(response: AuthResponse): AuthSession {
    return {
      ...response,
      type: response.type ?? 'Bearer',
    };
  }
}
