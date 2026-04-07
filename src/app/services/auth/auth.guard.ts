import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // Si estamos en el servidor de Node, bloqueamos el acceso silenciosamente
  if (!isPlatformBrowser(platformId)) {
    return false;
  }

  // Si estamos en el navegador, hacemos la comprobación real
  const token = localStorage.getItem('access_token');

  if (token) {
    return true; // Adelante, pasa.
  }

  // ¡Alto ahí! Sin token te vas al login.
  router.navigate(['/login']);
  return false;
};