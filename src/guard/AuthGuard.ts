import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})

//guardia de rutas
export class AuthGuard  {
  constructor(private cookieService: CookieService, private router: Router) {}

  /*el metodo se carga de chekear el token que se almacena en las cookies del 
  navegador obligando a estar logueado para poder acceder a la informacion de la pagina
  */
  canActivate(): boolean {
    if (!this.cookieService.check('token')) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
