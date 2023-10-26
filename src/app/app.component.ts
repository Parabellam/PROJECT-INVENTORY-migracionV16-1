import { Component, OnInit, Renderer2 } from '@angular/core';
import { RouterLinkActive } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthServicesService } from './services/auth-services.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  /* ocultar y abrir el menu desplegable del item  habilitar */
  public isOpen = true;
  public menuOpen = false;
  public menuOpen2 = false; // Primer Drop Down
  public menuOpen3 = false; // Tickets Drop Down

  username: string;
  clienteSeleccionadoCodigo: string;

  private _clienteSeleccionado: string = '';

  // Donde se  guarda cada código para validar en el html
  private readonly _permissions = {
    permi1asi: '',
    permi2alq: '',
    permi3mue: '',
    permi4equ: '',
    permi5fun: '',
    permi6lic: '',
    permi7per: '',
    permi8bit: '',

    permi9gcl: '',
    permi10gpa: '',
    permi11gus: '',

    permi12hal: '',
    permi13hcl: '',
    permi14heq: '',
    permi15hfu: '',
    permi16hmu: '',
    permi17hpe: '',

    permi18tickets: '',
  };

  constructor(
    title: Title,
    private cookieService: CookieService,
    private router: Router,
    private authService: AuthServicesService,
    private renderer: Renderer2
  ) {
    title.setTitle('Equipos');
  }

  ngOnInit(): void {
    const clienteSeleccionadoCodigo = localStorage.getItem(
      'clienteSeleccionadoCodigo'
    );
    if (clienteSeleccionadoCodigo) {
      this.clienteSeleccionadoCodigo = clienteSeleccionadoCodigo;
    }

    const clienteSeleccionado = localStorage.getItem(
      '6t9t8gBH896T987t8H0YT796h896979G6RT79g6'
    );
    const sharedSecretCliente =
      'xXry0olWBKA0olBSBKS5eWKASBKABS5eolXWCBA0oWCBKA'; // CLAVE PARA DESENCRIPTAR CLIENTE
    this._clienteSeleccionado = CryptoJS.AES.decrypt(
      clienteSeleccionado,
      sharedSecretCliente
    ).toString(
      // Desencriptamos
      CryptoJS.enc.Utf8
    );

    const sharedSecret = 'BS5exry0olWCBKABS5exry0olWCBKABS5exry0olWCBKA'; //Clave secreta
    //Se obtiene el valor guardado en el titulo D49k1gedp6D49k1gedp6 del localstorage
    // Todos estos valores es para validar, obtener que componentes de la barra de navegación puede ver
    const permi1asi = localStorage.getItem('D49k1gedp6D49k1gedp6'); //Asignaciones
    if (permi1asi) {
      this._permissions.permi1asi = CryptoJS.AES.decrypt(
        permi1asi,
        sharedSecret
      ).toString(CryptoJS.enc.Utf8);
    }

    const permi2alq = localStorage.getItem('nWY8Qnp5Y0nWY8Qnp5Y0'); //Alquilados
    if (permi2alq) {
      this._permissions.permi2alq = CryptoJS.AES.decrypt(
        permi2alq,
        sharedSecret
      ).toString(CryptoJS.enc.Utf8);
    }

    const permi3mue = localStorage.getItem('JlqmcuqRwfJlqmcuqRwf'); //Muebles
    if (permi3mue) {
      this._permissions.permi3mue = CryptoJS.AES.decrypt(
        permi3mue,
        sharedSecret
      ).toString(CryptoJS.enc.Utf8);
    }

    const permi4equ = localStorage.getItem('RhaYCnBPxwRhaYCnBPxw'); //Equipos
    if (permi4equ) {
      this._permissions.permi4equ = CryptoJS.AES.decrypt(
        permi4equ,
        sharedSecret
      ).toString(CryptoJS.enc.Utf8);
    }

    const permi5fun = localStorage.getItem('WPfoE59u4JWPfoE59u4J'); //Funcionarios
    if (permi5fun) {
      this._permissions.permi5fun = CryptoJS.AES.decrypt(
        permi5fun,
        sharedSecret
      ).toString(CryptoJS.enc.Utf8);
    }

    const permi6lic = localStorage.getItem('rM3bOFjzeorM3bOFjzeo'); //Licencias
    if (permi6lic) {
      this._permissions.permi6lic = CryptoJS.AES.decrypt(
        permi6lic,
        sharedSecret
      ).toString(CryptoJS.enc.Utf8);
    }

    const permi7per = localStorage.getItem('ymwTeYg32iymwTeYg32i'); //Periféricos
    if (permi7per) {
      this._permissions.permi7per = CryptoJS.AES.decrypt(
        permi7per,
        sharedSecret
      ).toString(CryptoJS.enc.Utf8);
    }

    const permi8bit = localStorage.getItem('mF48JmFg48mF48JmFg48'); //Bitácora
    if (permi8bit) {
      this._permissions.permi8bit = CryptoJS.AES.decrypt(
        permi8bit,
        sharedSecret
      ).toString(CryptoJS.enc.Utf8);
    }

    const permi9gcl = localStorage.getItem('g99XNqkYmJg99XNqkYmJ'); //Gestión clientes
    if (permi9gcl) {
      this._permissions.permi9gcl = CryptoJS.AES.decrypt(
        permi9gcl,
        sharedSecret
      ).toString(CryptoJS.enc.Utf8);
    }

    const permi10gpa = localStorage.getItem('JVPMKbzc0DJVPMKbzc0D'); //Gestión parámetros
    if (permi10gpa) {
      this._permissions.permi10gpa = CryptoJS.AES.decrypt(
        permi10gpa,
        sharedSecret
      ).toString(CryptoJS.enc.Utf8);
    }

    const permi11gus = localStorage.getItem('XnYr4WVm4pXnYr4WVm4p'); //Gestión Usuarios y permisos
    if (permi11gus) {
      this._permissions.permi11gus = CryptoJS.AES.decrypt(
        permi11gus,
        sharedSecret
      ).toString(CryptoJS.enc.Utf8);
    }

    const permi12hal = localStorage.getItem('KxSEsGkmUSKxSEsGkmUS'); //Habilitar Alquilados
    if (permi12hal) {
      this._permissions.permi12hal = CryptoJS.AES.decrypt(
        permi12hal,
        sharedSecret
      ).toString(CryptoJS.enc.Utf8);
    }

    const permi13hcl = localStorage.getItem('rVogPpaDKGrVogPpaDKG'); //Habilitar clientes
    if (permi13hcl) {
      this._permissions.permi13hcl = CryptoJS.AES.decrypt(
        permi13hcl,
        sharedSecret
      ).toString(CryptoJS.enc.Utf8);
    }

    const permi14heq = localStorage.getItem('XId5JcLQMLXId5JcLQML'); //Habilitar equipos
    if (permi14heq) {
      this._permissions.permi14heq = CryptoJS.AES.decrypt(
        permi14heq,
        sharedSecret
      ).toString(CryptoJS.enc.Utf8);
    }

    const permi15hfu = localStorage.getItem('nSE7ZxZcxynSE7ZxZcxy'); //Habilitar funcionarios
    if (permi15hfu) {
      this._permissions.permi15hfu = CryptoJS.AES.decrypt(
        permi15hfu,
        sharedSecret
      ).toString(CryptoJS.enc.Utf8);
    }

    const permi16hmu = localStorage.getItem('XOVWi4n21kXOVWi4n21k'); //Habilitar muebles
    if (permi16hmu) {
      this._permissions.permi16hmu = CryptoJS.AES.decrypt(
        permi16hmu,
        sharedSecret
      ).toString(CryptoJS.enc.Utf8);
    }

    const permi17hpe = localStorage.getItem('a6R1mwqVCXa6R1mwqVCX'); //Habilitar perifericos
    if (permi17hpe) {
      this._permissions.permi17hpe = CryptoJS.AES.decrypt(
        permi17hpe,
        sharedSecret
      ).toString(CryptoJS.enc.Utf8);
    }

    const permi18tickets = localStorage.getItem('IWqIWUsWUsIqIWUszWUx'); //Tickets
    if (permi18tickets) {
      this._permissions.permi18tickets = CryptoJS.AES.decrypt(
        permi18tickets,
        sharedSecret
      ).toString(CryptoJS.enc.Utf8);
    }
  }

  get permissions() {
    return this._permissions;
  }

  /* cerrar sesion */
  logout() {
    this.cookieService.delete('token');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
    localStorage.removeItem('WPfoE59u4JWPfoE59u4J'); // Remove permisos (El nombre del permiso es un código)
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

    localStorage.removeItem('IWqIXXXWUsWUsIqIWUsXXXzWUx');
    localStorage.removeItem('IWqIXXXWUsWUqqqsIqIWUsXXXzWUx');

    localStorage.removeItem('IWqIWUsWUsIqIWUszWUx'); //Tickets

    localStorage.removeItem('6t9t8gBH896T987t8H0YT796h896979G6RT79g6'); // Remove cliente logeado
    localStorage.removeItem('clienteSeleccionadoCodigo');
    localStorage.removeItem('idCliente');
    sessionStorage.removeItem('token');
  }

  canActivate(): boolean {
    const isActive = localStorage.getItem('menu');
    if (isActive == '0') {
      return false;
    }
    return true;
  }

  mousemove() {
    this.authService.resetSessionTimer();
  }

  public get clienteSeleccionado(): string {
    return this._clienteSeleccionado;
  }
}
