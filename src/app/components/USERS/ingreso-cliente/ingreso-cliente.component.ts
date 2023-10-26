import { IngresarService } from 'src/app/services/ingresar.service';
import { Component, OnInit, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthServicesService } from 'src/app/services/auth-services.service';
import { ClienteLoginService } from 'src/app/services/cliente-login.service';
import { Usuario } from 'src/app/models/Usuario';
import { Cliente } from 'src/app/models/Cliente';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-ingreso-cliente',
  templateUrl: './ingreso-cliente.component.html',
  styleUrls: ['./ingreso-cliente.component.css'],
})
export class IngresoClienteComponent implements OnInit {
  email: string;
  password: string;
  getUser: string;
  username: string;
  storage: string;
  clienteSeleccionado = '';
  clienteSeleccionadoCodigo = '';
  id: any;

  usuario: Usuario = new Usuario();
  usuarios: Usuario[] = [];

  permisos: Usuario[] = []; // Todos los usuarios
  permiso: Usuario = new Usuario(); // Usuario que está logeando

  clientes: Cliente[] = [];
  clientes2: any[];
  clientesMostrar: any;

  isActive: any = '0';

  token2: any; //

  constructor(
    private userService: IngresarService,
    private title: Title,
    private router: Router,
    private authService: AuthServicesService,
    private clienteLoginService: ClienteLoginService
  ) {
    title.setTitle('Cliente');
    localStorage.setItem('menu', this.isActive);
  }

  ngOnInit(): void {
    Promise.all([this.getEmail2()]).then(() => {
      Promise.all([this.listarUsuarios()]).then(() => {
        this.userService.listarUserByCorreo(this.email).subscribe({
          next: (usuario: Usuario) => {
            this.usuario = usuario;
          },
          error: (error) => {
            console.error(error);
          },
        });
      });
    });
  }

  getEmail2(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.email = this.clienteLoginService.getEmail() || '';
      this.password = this.clienteLoginService.getPassword() || '';
      resolve();
    });
  }

  listarUsuarios(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.userService.listarUsuario().subscribe((data: any) => {
        this.usuarios = data;
        // Buscar el usuario y asignarlo a la propiedad 'usuario'
        this.usuario = this.usuarios.find((u) => u.email === this.email);
        const clientesNoMostrar = this.usuario.clientes.filter((cliente) =>
          cliente.mostrar.includes('No')
        );
        const nombresClientes = clientesNoMostrar.map(
          (cliente) => cliente.nombre
        );

        this.clientesMostrar = nombresClientes;

        this.clientes2 = clientesNoMostrar;

        this.permisos = data; // Lista todos los usuarios
        this.permiso = this.permisos.find((u) => u.email === this.email); // Guarda el usuario que está logeando

        const qwer1qwer1 = this.permiso.asignaciones; // Guarda en cada constante el código que posee el usuario logeado en la base de datos
        const qwer2qwer2 = this.permiso.alquilados;
        const qwer3qwer3 = this.permiso.muebles;
        const qwer4qwer4 = this.permiso.equipos;
        const qwer5qwer5 = this.permiso.funcionarios;
        const qwer6qwer6 = this.permiso.licencias;
        const qwer7qwer7 = this.permiso.perifericos;
        const qwer8qwer8 = this.permiso.bitacora;

        const qwer9qwer9 = this.permiso.g_clientes;
        const qwer10qwer10 = this.permiso.g_parametros;
        const qwer11qwer11 = this.permiso.g_usuarios;

        const qwer12qwer12 = this.permiso.h_alquilados;
        const qwer13qwer13 = this.permiso.h_clientes;
        const qwer14qwer14 = this.permiso.h_equipos;
        const qwer15qwer15 = this.permiso.h_funcionarios;
        const qwer16qwer16 = this.permiso.h_muebles;
        const qwer17qwer17 = this.permiso.h_perifericos;

        const qwer18qwer18 = this.permiso.tickets;

        const sharedSecret = 'BS5exry0olWCBKABS5exry0olWCBKABS5exry0olWCBKA'; // CLAVE PARA DESENCRIPTAR

        const qwer1qwer1Encrypted = CryptoJS.AES.encrypt(
          qwer1qwer1,
          sharedSecret
        ).toString();
        const qwer2qwer2Encrypted = CryptoJS.AES.encrypt(
          qwer2qwer2,
          sharedSecret
        ).toString();
        const qwer3qwer3Encrypted = CryptoJS.AES.encrypt(
          qwer3qwer3,
          sharedSecret
        ).toString();
        const qwer4qwer4Encrypted = CryptoJS.AES.encrypt(
          qwer4qwer4,
          sharedSecret
        ).toString();
        const qwer5qwer5Encrypted = CryptoJS.AES.encrypt(
          qwer5qwer5,
          sharedSecret
        ).toString();
        const qwer6qwer6Encrypted = CryptoJS.AES.encrypt(
          qwer6qwer6,
          sharedSecret
        ).toString();
        const qwer7qwer7Encrypted = CryptoJS.AES.encrypt(
          qwer7qwer7,
          sharedSecret
        ).toString();
        const qwer8qwer8Encrypted = CryptoJS.AES.encrypt(
          qwer8qwer8,
          sharedSecret
        ).toString();
        const qwer9qwer9Encrypted = CryptoJS.AES.encrypt(
          qwer9qwer9,
          sharedSecret
        ).toString();
        const qwer10qwer10Encrypted = CryptoJS.AES.encrypt(
          qwer10qwer10,
          sharedSecret
        ).toString();
        const qwer11qwer11Encrypted = CryptoJS.AES.encrypt(
          qwer11qwer11,
          sharedSecret
        ).toString();
        const qwer12qwer12Encrypted = CryptoJS.AES.encrypt(
          qwer12qwer12,
          sharedSecret
        ).toString();
        const qwer13qwer13Encrypted = CryptoJS.AES.encrypt(
          qwer13qwer13,
          sharedSecret
        ).toString();
        const qwer14qwer14Encrypted = CryptoJS.AES.encrypt(
          qwer14qwer14,
          sharedSecret
        ).toString();
        const qwer15qwer15Encrypted = CryptoJS.AES.encrypt(
          qwer15qwer15,
          sharedSecret
        ).toString();
        const qwer16qwer16Encrypted = CryptoJS.AES.encrypt(
          qwer16qwer16,
          sharedSecret
        ).toString();
        const qwer17qwer17Encrypted = CryptoJS.AES.encrypt(
          qwer17qwer17,
          sharedSecret
        ).toString();
        const qwer18qwer18Encrypted = CryptoJS.AES.encrypt(
          qwer18qwer18,
          sharedSecret
        ).toString();

        const cargo = CryptoJS.AES.encrypt(
          this.usuario.cargo,
          sharedSecret
        ).toString();

        const nombre = CryptoJS.AES.encrypt(
          this.usuario.nombre,
          sharedSecret
        ).toString();

        localStorage.setItem('D49k1gedp6D49k1gedp6', qwer1qwer1Encrypted); // Guarda en el localstorage el código del permiso. (name y value son códigos)
        localStorage.setItem('nWY8Qnp5Y0nWY8Qnp5Y0', qwer2qwer2Encrypted);
        localStorage.setItem('JlqmcuqRwfJlqmcuqRwf', qwer3qwer3Encrypted);
        localStorage.setItem('RhaYCnBPxwRhaYCnBPxw', qwer4qwer4Encrypted);
        localStorage.setItem('WPfoE59u4JWPfoE59u4J', qwer5qwer5Encrypted);
        localStorage.setItem('rM3bOFjzeorM3bOFjzeo', qwer6qwer6Encrypted);
        localStorage.setItem('ymwTeYg32iymwTeYg32i', qwer7qwer7Encrypted);
        localStorage.setItem('mF48JmFg48mF48JmFg48', qwer8qwer8Encrypted);

        localStorage.setItem('g99XNqkYmJg99XNqkYmJ', qwer9qwer9Encrypted);
        localStorage.setItem('JVPMKbzc0DJVPMKbzc0D', qwer10qwer10Encrypted);
        localStorage.setItem('XnYr4WVm4pXnYr4WVm4p', qwer11qwer11Encrypted);

        localStorage.setItem('KxSEsGkmUSKxSEsGkmUS', qwer12qwer12Encrypted);
        localStorage.setItem('rVogPpaDKGrVogPpaDKG', qwer13qwer13Encrypted);
        localStorage.setItem('XId5JcLQMLXId5JcLQML', qwer14qwer14Encrypted);
        localStorage.setItem('nSE7ZxZcxynSE7ZxZcxy', qwer15qwer15Encrypted);
        localStorage.setItem('XOVWi4n21kXOVWi4n21k', qwer16qwer16Encrypted);
        localStorage.setItem('a6R1mwqVCXa6R1mwqVCX', qwer17qwer17Encrypted);

        localStorage.setItem('IWqIWUsWUsIqIWUszWUx', qwer18qwer18Encrypted);

        localStorage.setItem('IWqIXXXWUsWUsIqIWUsXXXzWUx', cargo);
        localStorage.setItem('IWqIXXXWUsWUqqqsIqIWUsXXXzWUx', nombre);
        resolve();
      });
    });
  }

  selectCliente() {
    const sharedSecretCliente =
      'xXry0olWBKA0olBSBKS5eWKASBKABS5eolXWCBA0oWCBKA'; // CLAVE PARA DESENCRIPTAR CLIENTE

    const clienteSeleccionadoEncrypted = CryptoJS.AES.encrypt(
      this.clienteSeleccionado,
      sharedSecretCliente
    ).toString();

    localStorage.setItem(
      '6t9t8gBH896T987t8H0YT796h896979G6RT79g6',
      clienteSeleccionadoEncrypted
    ); // Guarda el cliente seleccionado para ver la información
    localStorage.setItem(
      'clienteSeleccionadoCodigo',
      this.clienteSeleccionadoCodigo
    );
  }

  login() {
    this.authService.startSessionTimer();

    this.isActive = '1';
    localStorage.setItem('menu', this.isActive);

    if (this.clienteSeleccionado == 'Nexos') {
      this.router.navigate(['/']);
    } else {
      this.router.navigate(['/inicio-cliente']);
    }

    // Verificar si la página ya ha sido recargada
    setTimeout(() => {
      location.reload();
    }, 1);
  }
}
