import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { TokenStorageService } from './token-storage.service';

export const authGuard: CanActivateFn = (_route, state): boolean | UrlTree => {
  const tokenStorage = inject(TokenStorageService);
  if (tokenStorage.isAuthenticated()) {
    return true;
  }

  const router = inject(Router);
  return router.createUrlTree(['/login'], {
    queryParams: state.url ? { redirectTo: state.url } : undefined,
  });
};
