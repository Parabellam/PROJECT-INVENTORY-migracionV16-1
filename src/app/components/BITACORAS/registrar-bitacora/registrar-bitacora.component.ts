import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Bitacora } from 'src/app/models/Bitacora';
import { Equipo } from 'src/app/models/Equipo';
import { Parametros } from 'src/app/models/Parametros';
import { BitacoraService } from 'src/app/services/bitacora.service';
import Swal from 'sweetalert2';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-registrar-bitacora',
  templateUrl: './registrar-bitacora.component.html',
  styleUrls: ['./registrar-bitacora.component.css'],
})
export class RegistrarBitacoraComponent implements OnInit {
  /** variables  */
  parametro: Parametros[] = [];
  equipo: Equipo[] = [];
  bitacoras: Bitacora = new Bitacora();
  bitacora: Bitacora[] = [];
  equipoFiltrado: any[];
  captura: any;

  private readonly _permissions = {
    permi8bit: '',
  };

  clienteSeleccionado: string;

  constructor(
    private bitacoraService: BitacoraService,
    private router: Router
  ) {
    const permi8bit = localStorage.getItem('mF48JmFg48mF48JmFg48');
    const sharedSecret = 'BS5exry0olWCBKABS5exry0olWCBKABS5exry0olWCBKA'; // Generamos la llave para desencriptar
    const permi8bitX = CryptoJS.AES.decrypt(permi8bit, sharedSecret).toString(
      // Desencriptamos
      CryptoJS.enc.Utf8
    );
    if (permi8bit) {
      this._permissions.permi8bit = permi8bitX;
    }
  }

  ngOnInit(): void {
    const clienteSeleccionado = localStorage.getItem('6t9t8gBH896T987t8H0YT796h896979G6RT79g6');
    const sharedSecretCliente =
      'xXry0olWBKA0olBSBKS5eWKASBKABS5eolXWCBA0oWCBKA'; // CLAVE PARA DESENCRIPTAR CLIENTE
    this.clienteSeleccionado = CryptoJS.AES.decrypt(
      clienteSeleccionado,
      sharedSecretCliente
    ).toString(
      // Desencriptamos
      CryptoJS.enc.Utf8
    );
    this.listarBitacora();
  }

  get permissions() {
    return this._permissions;
  }

  selectedDate: string;
  currentDate = new Date().toISOString().split('T')[0];

  /** control de fechas futuraas */
  today = new Date();
  minDate = new Date(
    this.today.getFullYear(),
    this.today.getMonth(),
    this.today.getDate()
  );

  updateMinDate() {
    this.minDate = new Date();
    this.minDate.setHours(0, 0, 0, 0);
  }

  /** crear  bitacora */
  crearBitacora(): void {
    this.bitacoras.mostrar_cliente = this.clienteSeleccionado;

    this.bitacoras.codigoEquipo = this.captura;
    this.bitacoraService.createBinnacle(this.bitacoras).subscribe(
      (data) => {
        Swal.fire({
          position: 'top',
          icon: 'success',
          title: 'Registrado con Éxito',
          showConfirmButton: false,
          timer: 1500,
        });

        this.router.navigate(['/bitacoras/ver']);
      },
      (err) => {
        Swal.fire({
          title: 'Upss, existe un error ',
          icon: 'error',
        });
      }
    );
  }

  /** listar bitacora  */
  listarBitacora(): void {
    this.bitacoraService
      .listarBitacora('No', this.clienteSeleccionado)
      .subscribe((data) => {
        // Filtro 1: guardar solo los datos con el mismo cliente seleccionado
        const bitacoraFiltradaPorCliente = data.filter(
          (item) => item.mostrar_cliente === this.clienteSeleccionado
        );
        // Filtro 2: guardar solo los datos con códigos de equipo no repetidos
        const bitacoraFiltradaPorCodigoEquipo =
          bitacoraFiltradaPorCliente.reduce((acc, curr) => {
            if (!acc.some((item) => item.codigoEquipo === curr.codigoEquipo)) {
              acc.push(curr);
            }
            return acc;
          }, []);
        // Guardar la bitácora filtrada en this.bitacora
        this.bitacora = bitacoraFiltradaPorCodigoEquipo;
      });
  }
}
