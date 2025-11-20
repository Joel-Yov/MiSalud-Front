import { Injectable } from '@angular/core';

export type AppRuntimeConfig = {
  apiBaseUrl?: string;
};

@Injectable({ providedIn: 'root' })
export class AppConfigService {
  private config: AppRuntimeConfig = {};

  load(): Promise<void> {
    // Load config at runtime to avoid rebuilds per environment
    const url = '/assets/app-config.json';
    return fetch(url, { cache: 'no-store' })
      .then(async (res) => {
        if (!res.ok) return; // Non-blocking if missing in dev
        const json = (await res.json()) as AppRuntimeConfig;
        this.config = json ?? {};
      })
      .catch(() => {
        // Ignore missing file or network errors in dev
      })
      .then(() => void 0);
  }

  get apiBaseUrl(): string | undefined {
    return this.config.apiBaseUrl?.trim() || undefined;
  }
}
