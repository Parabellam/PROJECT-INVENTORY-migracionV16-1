import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AlquiladoService } from 'src/app/services/alquilado.service';
import * as AOS from 'aos';
import { Alquilado } from 'src/app/models/Alquilado';
import Swal from 'sweetalert2';
import { Bitacora } from 'src/app/models/Bitacora';
import { BitacoraService } from 'src/app/services/bitacora.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-registrar-alquilado',
  templateUrl: './registrar-alquilado.component.html',
  styleUrls: ['./registrar-alquilado.component.css'],
})
export class RegistrarAlquiladoComponent {
  alquilado: Alquilado = new Alquilado();
  estado: string[] = ['Disponible', 'Asignado', 'De baja'];
  tipoPeriferico: string[] = [
    'Base',
    'Diadema',
    'Teclado',
    'Mouse',
    'Cargador',
    'Portatil',
    'Monitor',
  ];
  mostrar: string[] = ['No', 'Si'];
  hiddenFile = true;
  other: any;
  tipo: any;

  bitacora: Bitacora[] = [];
  _bitacora: Bitacora = new Bitacora();
  actividad: string;
  codigo: string;
  fecha: any;
  clienteSeleccionado: string;

  private readonly _permissions = {
    permi2alq: '',
  };

  constructor(
    private alquiladoService: AlquiladoService,
    private bitacoraService: BitacoraService,
    private router: Router,
    private titulo: Title
  ) {
    titulo.setTitle('Registrar Alquilado');
    const permi2alq = localStorage.getItem('nWY8Qnp5Y0nWY8Qnp5Y0');
    const sharedSecret = 'BS5exry0olWCBKABS5exry0olWCBKABS5exry0olWCBKA'; // Generamos la llave para desencriptar
    const permi2alqX = CryptoJS.AES.decrypt(permi2alq, sharedSecret).toString(
      // Desencriptamos
      CryptoJS.enc.Utf8
    );
    if (permi2alq) {
      this._permissions.permi2alq = permi2alqX;
    }
    const clienteSeleccionado = localStorage.getItem(
      '6t9t8gBH896T987t8H0YT796h896979G6RT79g6'
    );
    const sharedSecretCliente =
      'xXry0olWBKA0olBSBKS5eWKASBKABS5eolXWCBA0oWCBKA'; // CLAVE PARA DESENCRIPTAR CLIENTE
    this.clienteSeleccionado = CryptoJS.AES.decrypt(
      clienteSeleccionado,
      sharedSecretCliente
    ).toString(
      // Desencriptamos
      CryptoJS.enc.Utf8
    );
  }

  ngOnInit() {
    AOS.init();
  }

  get permissions() {
    return this._permissions;
  }


  currentDate = new Date().toISOString().split('T')[0];
  maxDate: Date;

  updateMaxDate() {
    const fechaDate = new Date(this.alquilado.fecha);
    this.maxDate = new Date();
    this.maxDate.setHours(23, 59, 59, 999);
    if (fechaDate > this.maxDate) {
      this.alquilado.fecha = this.maxDate.toISOString().split('T')[0];
    }
  }

  onCreate(): void {
    this.alquilado.mostrar_cliente = this.clienteSeleccionado;
    this.alquilado.estado = 'Disponible';
    this.alquilado.mostrar = 'No';
    this.alquilado.precio = this.alquilado.precio.replace(/[^0-9]*/g, '');
    this.alquiladoService.crearAlquilado(this.alquilado).subscribe(
      (data) => {
        this.codigo = data.codigo_equipo;
        this.alquilado.fecha = new Date().toISOString();
        this.fecha = new Date().toISOString().split('T')[0];
        this.actividad =
          'Se registró un nuevo equipo alquilado con el código ' +
          this.codigo +
          ' el día ' +
          this.fecha;

        this.bitacoraService
          .crearBitacora(
            this._bitacora,
            this.actividad,
            this.codigo,
            this.fecha,
            this.clienteSeleccionado
          )
          .subscribe((data) => {});
        Swal.fire({
          position: 'top',
          icon: 'success',
          title: 'Alquilado creado con Éxito',
          showConfirmButton: false,
          timer: 1500,
        });
        this.router.navigate(['/alquilados/ver']);
      },
      (err) => {
        Swal.fire({
          title: 'Upss, existe un error ',
          icon: 'error',
        });
        console.log(err);
      }
    );
  }

  convertToNumber(value: string): number {
    const numberValue = parseFloat(value.replace(/,/g, ''));
    return numberValue;
  }
}
