import { Injectable } from '@angular/core';

export type AppRuntimeConfig = {
  apiBaseUrl?: string;
};

@Injectable({ providedIn: 'root' })
export class AppConfigService {
  private readonly configUrl = '/assets/app-config.json';
  private config: AppRuntimeConfig = {};

  async load(): Promise<void> {
    try {
      const response = await fetch(this.configUrl, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`Could not load runtime configuration (${response.status} ${response.statusText})`);
      }

      const json = (await response.json()) as AppRuntimeConfig | null;
      this.config = json ?? {};
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to load application runtime configuration.', error);
      throw error instanceof Error ? error : new Error('Unknown error loading runtime configuration.');
    }

    const baseUrl = this.apiBaseUrl;
    if (!baseUrl) {
      const missingConfigError = new Error('Runtime configuration must define a non-empty "apiBaseUrl" value.');
      // eslint-disable-next-line no-console
      console.error(missingConfigError.message);
      throw missingConfigError;
    }
  }

  get apiBaseUrl(): string | undefined {
    const trimmed = this.config.apiBaseUrl?.trim();
    return trimmed && trimmed.length > 0 ? trimmed : undefined;
  }
}
