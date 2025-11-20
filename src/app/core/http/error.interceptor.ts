import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Centralized error logging; extend with monitoring tool if needed
      // eslint-disable-next-line no-console
      console.error('HTTP error', {
        url: req.url,
        method: req.method,
        status: error.status,
        message: error.message,
      });
      return throwError(() => error);
    })
  );
};
