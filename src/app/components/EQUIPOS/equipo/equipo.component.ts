import { Equipo } from '../../../models/Equipo';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { EquipoServiceService } from 'src/app/services/equipo-service.service';
import { Parametros } from 'src/app/models/Parametros';
import { IngresarService } from 'src/app/services/ingresar.service';
import * as AOS from 'aos';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-equipo',
  templateUrl: './equipo.component.html',
  styleUrls: ['./equipo.component.css'],
})
export class EquipoComponent implements OnInit {
  clienteSeleccionado: string;
  isLoaded = true;

  filterPost = '';
  equipo: Equipo[] = [];
  parametro: Parametros[] = [];
  public page!: number;
  teams: any[];
  teams2: any[];
  public getUser: string;
  public storage: string;
  public username: string;
  length: any;

  codigos: any[] = ['', '03', '04'];
  code: any;

  openNewTab(url: string) {
    window.open(url, '_blank');
  }

  private readonly _permissions = {
    permi4equ: '',
  };

  constructor(
    private equipoService: EquipoServiceService,
    private titulo: Title,
    private userService: IngresarService
  ) {
    titulo.setTitle('Equipos');

    /**--------------------desencriptar token-------------------------------- */
    this.storage = userService.getToken();
    localStorage.setItem('token', JSON.stringify(this.storage));
    this.getUser = userService.getToken();

    const permi4equ = localStorage.getItem('RhaYCnBPxwRhaYCnBPxw');
    const sharedSecret = 'BS5exry0olWCBKABS5exry0olWCBKABS5exry0olWCBKA'; // CLAVE PARA DESENCRIPTAR PERMISO
    const permi4equX = CryptoJS.AES.decrypt(permi4equ, sharedSecret).toString(
      // Desencriptamos
      CryptoJS.enc.Utf8
    );
    if (permi4equ) {
      this._permissions.permi4equ = permi4equX;
    }
  }

  /**----------------------------------- ngonInit ---------------------------------------- */
  ngOnInit(): void {
    const clienteSeleccionado = localStorage.getItem(
      '6t9t8gBH896T987t8H0YT796h896979G6RT79g6'
    ); // Obtiene cliente seleccionado

    const sharedSecretCliente =
      'xXry0olWBKA0olBSBKS5eWKASBKABS5eolXWCBA0oWCBKA'; // CLAVE PARA DESENCRIPTAR CLIENTE
    this.clienteSeleccionado = CryptoJS.AES.decrypt(
      clienteSeleccionado,
      sharedSecretCliente
    ).toString(
      // Desencriptamos
      CryptoJS.enc.Utf8
    );
    if (!this.isLoaded) {
      // Realice la carga aquí
      this.loadData();
      this.isLoaded = false;
    }

    AOS.init();
    this.listarEquipo();
  }

  get permissions() {
    return this._permissions;
  }

  loadData() {
    if (!this.isLoaded) {
      // Realice la carga aquí
      this.isLoaded = false;
      location.reload();
    }
  }

  /*-----------------------listar equipos---------------------------*/
  listarEquipo(): void {
    this.equipoService
      .listarEquipo('No', this.clienteSeleccionado)
      .subscribe((data) => {
        this.teams = data;
        this.teams2 = data;
        this.equipo = data.reverse();
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

  filtroCodigo(code: any) {
    const equiposFiltrados = this.teams.filter(
      (equipo) => equipo.parametros.tipo_parametro === code
    );
    // Asigna los equipos filtrados a this.teams2
    this.teams2 = equiposFiltrados;
    this.page = 1;
    if (code == '') {
      this.teams2 = this.teams;
    }
  }

  resetPage() {
    this.page = 1;
  }

  /** filter data of files what need in the table */
  filtrarDatos(): any[] {
    return this.equipo.map((equipo) => {
      const licencias = equipo.licencias.map((licencia) => licencia.nombre);
      const codigoEquipo = `${equipo.parametros.tipo_parametro}-${equipo.codigo_equipo}`;
      return {
        id_equipo: equipo.id_equipo,
        Codigo_Equipo: codigoEquipo,
        Tipo_Dispositivo: equipo.tipo,
        Marca: equipo.marca,
        Modelo: equipo.modelo,
        Serial: equipo.seriall,
        Sistema_Operativo: equipo.os,
        Procesador: equipo.procesador,
        Almacenamiento: equipo.almacenamiento,
        Memoria_Ram: equipo.ram,
        Factura: equipo.factura,
        Fecha_Factura: equipo.fecha_factura,
        Precio: equipo.precio,
        Orden: equipo.orden,
        Observaciones: equipo.observaciones,
        Tiket: equipo.tiket,
        Estado: equipo.estado,
        Fecha_Modificacion: equipo.fecha_modificacion,
        Usuario_Crea: equipo.usuario_crea,
        Usuario_Modifica: equipo.usuario_modifica,
        Licencias: licencias,
      };
    });
  }

  exportExcel() {
    const filterData = this.filtrarDatos();
    import('xlsx').then((xlsx) => {
      const transformedData = filterData.map((item) => ({
        ...item,
        Licencias: item.Licencias?.join(', '),
      }));
      const worksheet = xlsx.utils.json_to_sheet(transformedData, {
        header: [],
        skipHeader: false,
      });
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer, 'Equipos');
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    const url = window.URL.createObjectURL(data);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display:none');
    a.href = url;
    a.download = fileName + '.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}
