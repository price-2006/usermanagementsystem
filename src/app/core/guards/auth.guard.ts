import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

/**
 * Auth guard — since authentication is now validated against the REST API
 * (json-server) and there is no persistent session token, we use a simple
 * in-memory flag set by the LoginComponent on successful login.
 */
let isAuthenticated = false;

export function setAuthenticated(value: boolean): void {
  isAuthenticated = value;
}

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  if (isAuthenticated) {
    return true;
  }
  router.navigate(['/login']);
  return false;
};
