import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdministrativoGuard implements CanActivate {
  getUser: string;
  username: string;
  constructor(private router: Router, private jwtHelper: JwtHelperService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.getUser = localStorage.getItem('token');
    const tokenPayload = this.jwtHelper.decodeToken(this.getUser);
    this.username = tokenPayload.rol;
    if (this.username === '[ADMINISTRATIVO]') {
      return false;
    }
    return true;
  }
}
