import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import jwtDecode from 'jwt-decode';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})

/** esta  clase se encarga de  obtener el usuario y el rol para poder
 * darle los permisos necesarios segun el rol del usuario registrados
 */
export class AdminGuard implements CanActivate {
  getUser: string;
  username: string;
  constructor(private router: Router,
    private jwtHelper:JwtHelperService
    ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.getUser = localStorage.getItem('token');
    const tokenPayload = this.jwtHelper.decodeToken(this.getUser);
    this.username = tokenPayload.rol;

    if (this.username != '[ADMIN]') {
      return false;
    }
    return true;
  }
}
