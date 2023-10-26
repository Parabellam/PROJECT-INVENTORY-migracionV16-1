import { Bitacora } from './../../../models/Bitacora';
import { BitacoraService } from 'src/app/services/bitacora.service';
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import * as AOS from 'aos';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Parametros } from 'src/app/models/Parametros';
import { ParametrosService } from 'src/app/services/parametros.service';
import { Equipo } from '../../../models/Equipo';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-bitacora',
  templateUrl: './bitacora.component.html',
  styleUrls: ['./bitacora.component.css'],
})
export class BitacoraComponent {
  filterPost = '';
  filterPost1 = '';
  filterPost2 = '';
  bitacora: Bitacora[] = [];
  public page: number;
  length: any;
  parametro: Parametros[] = [];
  client: string;
  isNxs: boolean = false;
  private readonly _permissions = {
    permi8bit: '',
  };

  private _clienteSeleccionado: string = '';

  constructor(
    private bitacoraService: BitacoraService,
    private jwtHelper: JwtHelperService,
    private parametrosService: ParametrosService,
    private titulo: Title
  ) {
    titulo.setTitle('Bitácora');
    const permi8bit = localStorage.getItem('mF48JmFg48mF48JmFg48');
    const sharedSecret = 'BS5exry0olWCBKABS5exry0olWCBKABS5exry0olWCBKA'; // Generamos la llave para desencriptar
    const permi8bitX = CryptoJS.AES.decrypt(permi8bit, sharedSecret).toString(
      // Desencriptamos
      CryptoJS.enc.Utf8
    );
    if (permi8bit) {
      this._permissions.permi8bit = permi8bitX;
    }
    this.client = localStorage.getItem('clienteSeleccionadoCodigo');
    if (this.client === 'Nexos') {
      this.isNxs = true
    }
  }


  /**----------------------------------- ngonInit ---------------------------------------- */
  ngOnInit(): void {
    const clienteSeleccionado = localStorage.getItem(
      '6t9t8gBH896T987t8H0YT796h896979G6RT79g6'
    );
    const sharedSecretCliente =
      'xXry0olWBKA0olBSBKS5eWKASBKABS5eolXWCBA0oWCBKA'; // CLAVE PARA DESENCRIPTAR CLIENTE
    this._clienteSeleccionado = CryptoJS.AES.decrypt(
      clienteSeleccionado,
      sharedSecretCliente
    ).toString(CryptoJS.enc.Utf8);

    this.listarParametros();
    AOS.init();
    this.listarBitacora();
  }

  get permissions() {
    return this._permissions;
  }

  public get clienteSeleccionado(): string {
    return this._clienteSeleccionado;
  }

  //Reset paginación al buscar en un filtro o hacer alguna acción
  resetPage() {
    this.page = 1;
  }

  // Total de Resultados de los 3 filtros
  public getResultsCount(): number {
    let filteredBitacoras = this.bitacora.filter(
      (item) =>
        item.actividad.includes(this.filterPost) &&
        item.codigoEquipo.slice(0, 2).includes(this.filterPost1) &&
        item.codigoEquipo.includes(this.filterPost2) &&
        item.mostrar_cliente.includes(this.clienteSeleccionado)
    );
    return filteredBitacoras.length;
  }

  /*-----------------------listar bitacora---------------------------*/
  listarBitacora(): void {
    this.bitacoraService
      .listarBitacora('No', this.clienteSeleccionado)
      .subscribe((data) => {
        this.bitacora = data.reverse();
      });
  }

  listarParametros() {
    this.parametrosService.listarParametros().subscribe((data) => {
      this.parametro = data.filter(
        (parametro) =>
          parametro.tipo_parametro.includes('03') ||
          parametro.tipo_parametro.includes('04')
      );
    });
  }

  //item per page
  ipp: number;
  selectedIpp: number = 10;
  ippdd: string[] = ['10', '25', '50', '100'];

  // Event Click Tamaño Paginación
  ippclick(ipp: any) {
    this.selectedIpp = ipp;
    this.page = 1;
  }
}
