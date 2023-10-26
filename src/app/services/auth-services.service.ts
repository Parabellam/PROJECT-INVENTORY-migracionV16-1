import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthServicesService {
  private sessionTimeout: any;

  constructor(private cookies: CookieService, private router: Router) {}

  startSessionTimer() {
    this.sessionTimeout = setTimeout(() => {
      this.logout();
    }, 900000); // 15 minutes in milliseconds
  }
  resetSessionTimer() {
    clearTimeout(this.sessionTimeout);
    this.startSessionTimer();
  }

  logout() {
    this.cookies.delete('token');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
    localStorage.removeItem('WPfoE59u4JWPfoE59u4J');
    localStorage.removeItem('XnYr4WVm4pXnYr4WVm4p');
    localStorage.removeItem('ymwTeYg32iymwTeYg32i');
    localStorage.removeItem('rM3bOFjzeorM3bOFjzeo');
    localStorage.removeItem('JVPMKbzc0DJVPMKbzc0D');
    localStorage.removeItem('a6R1mwqVCXa6R1mwqVCX');
    localStorage.removeItem('D49k1gedp6D49k1gedp6');
    localStorage.removeItem('JlqmcuqRwfJlqmcuqRwf');
    localStorage.removeItem('KxSEsGkmUSKxSEsGkmUS');
    localStorage.removeItem('XId5JcLQMLXId5JcLQML');
    localStorage.removeItem('nWY8Qnp5Y0nWY8Qnp5Y0');
    localStorage.removeItem('RhaYCnBPxwRhaYCnBPxw');
    localStorage.removeItem('nSE7ZxZcxynSE7ZxZcxy');
    localStorage.removeItem('g99XNqkYmJg99XNqkYmJ');
    localStorage.removeItem('XOVWi4n21kXOVWi4n21k');
    localStorage.removeItem('mF48JmFg48mF48JmFg48');
    localStorage.removeItem('rVogPpaDKGrVogPpaDKG');

    localStorage.removeItem('IWqIWUsWUsIqIWUszWUx'); //Tickets

    localStorage.removeItem('6t9t8gBH896T987t8H0YT796h896979G6RT79g6'); // Remove cliente logeado

    localStorage.removeItem('clienteSeleccionado');
    localStorage.removeItem('clienteSeleccionadoCodigo');
    localStorage.removeItem('idCliente');
  }
}
