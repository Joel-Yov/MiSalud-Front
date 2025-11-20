import { Injectable, computed, signal } from '@angular/core';
import { AuthSession } from '../models/api-models';

const STORAGE_KEY = 'misalud.auth.session';

@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  private readonly state = signal<AuthSession | null>(this.restoreSession());

  readonly session = computed(() => this.state());
  readonly token = computed(() => this.state()?.token ?? null);
  readonly isAuthenticated = computed(() => Boolean(this.state()?.token));

  setSession(session: AuthSession | null): void {
    this.state.set(session);
    const storage = this.getStorage();
    if (!storage) {
      return;
    }

    if (session) {
      storage.setItem(STORAGE_KEY, JSON.stringify(session));
    } else {
      storage.removeItem(STORAGE_KEY);
    }
  }

  clear(): void {
    this.setSession(null);
  }

  private restoreSession(): AuthSession | null {
    const storage = this.getStorage();
    if (!storage) {
      return null;
    }

    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as AuthSession;
    } catch {
      storage.removeItem(STORAGE_KEY);
      return null;
    }
  }

  private getStorage(): Storage | null {
    if (typeof window === 'undefined') {
      return null;
    }

    try {
      return window.localStorage;
    } catch {
      return null;
    }
  }
}
