import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenStorageService } from '../auth/token-storage.service';

const API_PATH_HINT = '/api/';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenStorage = inject(TokenStorageService);
  const session = tokenStorage.session();
  const token = session?.token;

  if (!token) {
    return next(req);
  }

  const url = req.url ?? '';
  const isApiRequest = url.startsWith('/api') || url.includes(API_PATH_HINT);

  if (!isApiRequest || req.headers.has('Authorization')) {
    return next(req);
  }

  const authType = session?.type ?? 'Bearer';
  const cloned = req.clone({
    setHeaders: {
      Authorization: `${authType} ${token}`,
    },
  });

  return next(cloned);
};
