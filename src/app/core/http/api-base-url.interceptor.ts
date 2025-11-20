import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AppConfigService } from '../config/app-config.service';

export const apiBaseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const cfg = inject(AppConfigService);
  const base = cfg.apiBaseUrl;

  if (base && req.url.startsWith('/api')) {
    const url = base.replace(/\/$/, '') + req.url; // ensure no double slash
    req = req.clone({ url });
  }

  return next(req);
};
