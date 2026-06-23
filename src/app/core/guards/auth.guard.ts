import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  if (typeof window !== 'undefined' && window.localStorage.getItem('isLoggedIn') === 'true') {
    return true;
  }
  router.navigate(['/login']);
  return false;
};
