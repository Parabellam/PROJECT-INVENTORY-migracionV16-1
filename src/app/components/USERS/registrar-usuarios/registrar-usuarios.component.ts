import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/Usuario';
import { IngresarService } from 'src/app/services/ingresar.service';
import Swal from 'sweetalert2';
import { Cliente } from 'src/app/models/Cliente';
import { ClienteLoginService } from 'src/app/services/cliente-login.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-registrar-usuarios',
  templateUrl: './registrar-usuarios.component.html',
  styleUrls: ['./registrar-usuarios.component.css'],
})
export class RegistrarUsuariosComponent implements OnInit {
  user: Usuario = new Usuario();
  show: boolean = false; //MostrarContraseña

  // Asignar clientes a usuario
  cliente: Cliente[] = [];
  private readonly _permissions = {
    permi11gus: ''
}

  sede: string[] = [
    'SIN PERMISOS',
    'VER',
    'VER | EXPORTAR',
    'VER | EXPORTAR | CREAR | EDITAR',
    'VER | EXPORTAR | CREAR | EDITAR | INHABILITAR',
  ]; // Drop down de permisos (Dependiendo de la elección se asginará un código)

  constructor(
    private userService: IngresarService,
    private router: Router,
    private tittle: Title,
    private clienteLoginService: ClienteLoginService
  ) {
    tittle.setTitle('Registrar Usuarios');
    const permi11gus = localStorage.getItem('XnYr4WVm4pXnYr4WVm4p');
    const sharedSecret = 'BS5exry0olWCBKABS5exry0olWCBKABS5exry0olWCBKA'; // Generamos la llave para desencriptar
    const permi11gusX = CryptoJS.AES.decrypt(permi11gus, sharedSecret).toString(
      // Desencriptamos
      CryptoJS.enc.Utf8
    );
    if (permi11gus) {
      this._permissions.permi11gus
      = permi11gusX; // Permiso gestión usuarios
    }
  }

  get permissions() {
    return this._permissions;
  }

  ngOnInit(): void {
    this.listarCliente(); // Se listan clientes para asignar al usuario uno o varios.
  }

  contrasena() {
    this.show = !this.show; // Mostrar contraseña
  }

  // Se listan clientes para asignar al usuario uno o varios.
  listarCliente(): void {
    this.clienteLoginService.listarCliente('No').subscribe(
      (data) => {
        this.cliente = data;
      },
      (err) => {}
    );
  }

  /*-----------------------------------Registrar usuarios------------------------- ----------------*/

  //registrar nuevos usuarios
  //DEPENDIENDO DE LA OPCIÓN SELECCIONADA EN EL DROP DOWN 'SEDE' PARA PERMISOS, se asigna un código de permiso
  // Más info en codigos_permisos.txt en la carpeta main
  onCreate(): void {
    switch (this.user.asignaciones) {
      case 'SIN PERMISOS':
        this.user.asignaciones = 'dbOMGslVUkJBKmi'; //1
        break;
      case 'VER':
        this.user.asignaciones = 'Awoa1mUqQvKbjbV';
        break;
      case 'VER | EXPORTAR':
        this.user.asignaciones = 'UEtPmNDwhrfIgt0';
        break;
      case 'VER | EXPORTAR | CREAR | EDITAR':
        this.user.asignaciones = '1gxYGKqZnikfUZu';
        break;
      case 'VER | EXPORTAR | CREAR | EDITAR | INHABILITAR':
        this.user.asignaciones = 'LRWAgJ6Lp8WeyGn'; //5
        break;
    }

    switch (this.user.alquilados) {
      case 'SIN PERMISOS':
        this.user.alquilados = 'gVxrbcmdKJ3GOup'; //6
        break;
      case 'VER':
        this.user.alquilados = '13QQo6vCrU6Ld7H';
        break;
      case 'VER | EXPORTAR':
        this.user.alquilados = 'jt3A1zV8PrGgbBK';
        break;
      case 'VER | EXPORTAR | CREAR | EDITAR':
        this.user.alquilados = 'drzwGAHVb602GWL';
        break;
      case 'VER | EXPORTAR | CREAR | EDITAR | INHABILITAR':
        this.user.alquilados = 'sJocm9Vp1kqeQlr'; //10
        break;
    }

    switch (this.user.muebles) {
      case 'SIN PERMISOS':
        this.user.muebles = 'cpohJfFiOv5yMzb'; //11
        break;
      case 'VER':
        this.user.muebles = 'M3cBVSTaIWHJ1sG';
        break;
      case 'VER | EXPORTAR':
        this.user.muebles = 'YACMHArAq0qBl1U';
        break;
      case 'VER | EXPORTAR | CREAR | EDITAR':
        this.user.muebles = 'atbZw0plcoEaucF';
        break;
      case 'VER | EXPORTAR | CREAR | EDITAR | INHABILITAR':
        this.user.muebles = 'FIaw1HHFHTlpY5B'; //15
        break;
    }

    switch (this.user.equipos) {
      case 'SIN PERMISOS':
        this.user.equipos = 'pVcFgaocC78MPa0'; //16
        break;
      case 'VER':
        this.user.equipos = 'Sjy1wcui39ZBMrn';
        break;
      case 'VER | EXPORTAR':
        this.user.equipos = 'z8Wzh4te4a8q0sX';
        break;
      case 'VER | EXPORTAR | CREAR | EDITAR':
        this.user.equipos = 'gLM2KweKZBD5Rtw';
        break;
      case 'VER | EXPORTAR | CREAR | EDITAR | INHABILITAR':
        this.user.equipos = 'CyJlhVqcyf4Yx5q'; //20
        break;
    }

    switch (this.user.funcionarios) {
      case 'SIN PERMISOS':
        this.user.funcionarios = 'oWdOWKAwdL17OvP'; //21
        break;
      case 'VER':
        this.user.funcionarios = 'mKCrnh9NqM3GDFa';
        break;
      case 'VER | EXPORTAR':
        this.user.funcionarios = 'L0YtYwHDo4l83RP';
        break;
      case 'VER | EXPORTAR | CREAR | EDITAR':
        this.user.funcionarios = 'UAZkeJDNF7pOhuV';
        break;
      case 'VER | EXPORTAR | CREAR | EDITAR | INHABILITAR':
        this.user.funcionarios = 'CfDSYV3qEt07d7a'; //25
        break;
    }

    switch (this.user.licencias) {
      case 'SIN PERMISOS':
        this.user.licencias = 'EeWQHX7VHt0mf1q'; //26
        break;
      case 'VER':
        this.user.licencias = 'ftVXCWeFJJa4ljZ';
        break;
      case 'VER | EXPORTAR':
        this.user.licencias = 'LT8npsAKUZ8Ikvu';
        break;
      case 'VER | EXPORTAR | CREAR | EDITAR':
        this.user.licencias = 'JnNCNG8fu9OD9pS';
        break;
      case 'VER | EXPORTAR | CREAR | EDITAR | INHABILITAR':
        this.user.licencias = 'M9Csxpgi4jkdt4n'; //30
        break;
    }

    switch (this.user.perifericos) {
      case 'SIN PERMISOS':
        this.user.perifericos = 'T4lQ7hNVocnhTaj'; //31
        break;
      case 'VER':
        this.user.perifericos = 'sMcpUli2VOEA41j';
        break;
      case 'VER | EXPORTAR':
        this.user.perifericos = 'pByuNT3KvphzTP7';
        break;
      case 'VER | EXPORTAR | CREAR | EDITAR':
        this.user.perifericos = 'EmxZBnH3nJ2xrG2';
        break;
      case 'VER | EXPORTAR | CREAR | EDITAR | INHABILITAR':
        this.user.perifericos = 'uLuiTT5rFVcPzoX'; //35
        break;
    }

    switch (this.user.bitacora) {
      case 'SIN PERMISOS':
        this.user.bitacora = 'dMuOOCZCk3lA7Eo'; //36
        break;
      case 'VER':
        this.user.bitacora = 'GTbnxLGw2otSag4';
        break;
      case 'VER | EXPORTAR':
        this.user.bitacora = 'WlUJ8lgrWcui0Hy';
        break;
      case 'VER | EXPORTAR | CREAR | EDITAR':
        this.user.bitacora = '8IlNUd0FNJuhSpd';
        break;
      case 'VER | EXPORTAR | CREAR | EDITAR | INHABILITAR':
        this.user.bitacora = '0Y4oNoiABbnNIK5'; //40
        break;
    }

    switch (this.user.g_clientes) {
      case 'SIN PERMISOS':
        this.user.g_clientes = 'HXtNBu9Bw3cJzak'; //41
        break;
      case 'VER':
        this.user.g_clientes = 'IDAMHc7AGXpcfMy';
        break;
      case 'VER | EXPORTAR':
        this.user.g_clientes = 'hQxqN1kkm5Wb7eX';
        break;
      case 'VER | EXPORTAR | CREAR | EDITAR':
        this.user.g_clientes = 'lrrX9taf07qNxMs';
        break;
      case 'VER | EXPORTAR | CREAR | EDITAR | INHABILITAR':
        this.user.g_clientes = 'IToGYuj9agiXK2K'; //45
        break;
    }

    switch (this.user.g_parametros) {
      case 'SIN PERMISOS':
        this.user.g_parametros = 'f23rcZ0ZEB3IvVK'; //46
        break;
      case 'VER':
        this.user.g_parametros = '2nYnNJcWDX3Txwq';
        break;
      case 'VER | EXPORTAR':
        this.user.g_parametros = 'NY30gidbqABW9K2';
        break;
      case 'VER | EXPORTAR | CREAR | EDITAR':
        this.user.g_parametros = 'm7HI003lIchj8FN';
        break;
      case 'VER | EXPORTAR | CREAR | EDITAR | INHABILITAR':
        this.user.g_parametros = 'FlMKuG1RnzRXA2E'; //50
        break;
    }

    switch (this.user.g_usuarios) {
      case 'SIN PERMISOS':
        this.user.g_usuarios = 'frdNbYyR3kxAlgI'; //51
        break;
      case 'VER':
        this.user.g_usuarios = 'aMHhE8uRxQ9lRBD';
        break;
      case 'VER | EXPORTAR':
        this.user.g_usuarios = 'FCThk6XJfiPG327';
        break;
      case 'VER | EXPORTAR | CREAR | EDITAR':
        this.user.g_usuarios = 'L8v95Wl5c6pJA4o';
        break;
      case 'VER | EXPORTAR | CREAR | EDITAR | INHABILITAR':
        this.user.g_usuarios = 'fISN5iSOhlim92d'; //55
        break;
    }

    switch (this.user.h_alquilados) {
      case 'SIN PERMISOS':
        this.user.h_alquilados = 'tzSQisvdUpC3w3W'; //56
        break;
      case 'VER':
        this.user.h_alquilados = 'IwkHK6Zh0wlZewK';
        break;
      case 'VER | EXPORTAR':
        this.user.h_alquilados = 'SA85MCrHZEVUi0h';
        break;
      case 'VER | EXPORTAR | CREAR | EDITAR':
        this.user.h_alquilados = 'CMNtYx5D34NnsOb';
        break;
      case 'VER | EXPORTAR | CREAR | EDITAR | INHABILITAR':
        this.user.h_alquilados = 'oQ5fIsYrt2qfiNZ'; //60
        break;
    }

    switch (this.user.h_clientes) {
      case 'SIN PERMISOS':
        this.user.h_clientes = '5iWwfKRrBB8VfvX'; //61
        break;
      case 'VER':
        this.user.h_clientes = 'McTge3NAsOQMqAn';
        break;
      case 'VER | EXPORTAR':
        this.user.h_clientes = '22Y1Krxc7D8Xvkh';
        break;
      case 'VER | EXPORTAR | CREAR | EDITAR':
        this.user.h_clientes = '4tt0ARBQvK4e037';
        break;
      case 'VER | EXPORTAR | CREAR | EDITAR | INHABILITAR':
        this.user.h_clientes = 'CeqDviy5LbbP8Vj'; //65
        break;
    }

    switch (this.user.h_equipos) {
      case 'SIN PERMISOS':
        this.user.h_equipos = 'wjKeXfLu713WIEe'; //66
        break;
      case 'VER':
        this.user.h_equipos = 'VLBCcZURkhioh7N';
        break;
      case 'VER | EXPORTAR':
        this.user.h_equipos = 'Nqfr5LqHLYbN2Yh';
        break;
      case 'VER | EXPORTAR | CREAR | EDITAR':
        this.user.h_equipos = 'fjvUXgTJL1ss8Ls';
        break;
      case 'VER | EXPORTAR | CREAR | EDITAR | INHABILITAR':
        this.user.h_equipos = '9qT23HdNEHoK1EZ'; //70
        break;
    }

    switch (this.user.h_funcionarios) {
      case 'SIN PERMISOS':
        this.user.h_funcionarios = 'sYGM0awMDWTdMoi'; //71
        break;
      case 'VER':
        this.user.h_funcionarios = 'K7AYmFQZNEg6yhM';
        break;
      case 'VER | EXPORTAR':
        this.user.h_funcionarios = 'TNXkaRh1tuNEvyS';
        break;
      case 'VER | EXPORTAR | CREAR | EDITAR':
        this.user.h_funcionarios = 'BAa7IDeFXUA89hl';
        break;
      case 'VER | EXPORTAR | CREAR | EDITAR | INHABILITAR':
        this.user.h_funcionarios = 'U32T4jcCvUP8IQ6'; //75
        break;
    }

    switch (this.user.h_muebles) {
      case 'SIN PERMISOS':
        this.user.h_muebles = 'rMC4qZkB8YRoB0I'; //76
        break;
      case 'VER':
        this.user.h_muebles = 'qrWjfJ3i2Rvdot6';
        break;
      case 'VER | EXPORTAR':
        this.user.h_muebles = 'JnieFjgioj1RtwN';
        break;
      case 'VER | EXPORTAR | CREAR | EDITAR':
        this.user.h_muebles = 'OHrgzmatOatw4Nj';
        break;
      case 'VER | EXPORTAR | CREAR | EDITAR | INHABILITAR':
        this.user.h_muebles = 'UIyuIllroGhsKkJ'; //80
        break;
    }

    switch (this.user.h_perifericos) {
      case 'SIN PERMISOS':
        this.user.h_perifericos = 'Yd0JFCYtrTEMJxI'; //81
        break;
      case 'VER':
        this.user.h_perifericos = 'ctDkzjCBQlQlxbT';
        break;
      case 'VER | EXPORTAR':
        this.user.h_perifericos = 'FcrGm1KIUxWVjAK';
        break;
      case 'VER | EXPORTAR | CREAR | EDITAR':
        this.user.h_perifericos = 'IhEIvJ9kzu8oe7N';
        break;
      case 'VER | EXPORTAR | CREAR | EDITAR | INHABILITAR':
        this.user.h_perifericos = 'zH31IvM3Sz8Z9Sb'; //85
        break;
    }

    switch (this.user.tickets) {
      case 'SIN PERMISOS':
        this.user.tickets = 'K5ClodcrAGSjVIa'; //86
        break;
      case 'VER':
        this.user.tickets = 'sz3Kqfh0k3qtIWU'; //87
        break;
    }
    this.userService.register(this.user).subscribe(
      (data) => {
        this.userService.setRol(data);
        Swal.fire({
          position: 'top',
          icon: 'success',
          title: 'Usuario Registrado con Éxito',
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          this.router.navigate(['/usuarios/ver']);
        });
      },
      (err) => {
        Swal.fire({
          title: 'Upss, existe un error',
          icon: 'error',
        });
      }
    );
  }
}
