import { Component } from '@angular/core';
import { Bitacora } from './../../../models/Bitacora';
import { BitacoraService } from 'src/app/services/bitacora.service';
import { Title } from '@angular/platform-browser';
import * as AOS from 'aos';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-export-fechas',
  templateUrl: './export-fechas.component.html',
  styleUrls: ['./export-fechas.component.css'],
})
export class ExportFechasComponent {
  bitacora: Bitacora[] = [];
  bitacoras: Bitacora = new Bitacora();
  desde: string = '';
  hasta: string = '';
  clienteSeleccionado: string;

  private readonly _permissions = {
    permi8bit: '',
  };

  constructor(private bitacoraService: BitacoraService, private titulo: Title) {
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
    AOS.init();
    this.FiltrarBitacoraXFecha(this.desde, this.hasta);
  }

  get permissions() {
    return this._permissions;
  }

  currentDate = new Date().toISOString().split('T')[0];

  today = new Date();
  minDate = new Date(
    this.today.getFullYear(),
    this.today.getMonth(),
    this.today.getDate()
  );

  updateMinDate() {
    this.minDate = new Date();
    this.minDate.setHours(0, 0, 0, 0);
    if (this.bitacoras.fecha < this.minDate) {
      this.bitacoras.fecha = this.minDate;
    }
  }

  FiltrarBitacoraXFecha(desde: string, hasta: string) {
    this.bitacoraService
      .FiltrarBitacoraXFecha(desde, hasta)
      .subscribe((data) => {
        this.bitacora = data;
      });
  }

  /** filter data of files what need in the table */
  filtrarDatos(desde: string, hasta: string): any[] {
    const desdeDate = new Date(desde);
    const hastaDate = new Date(hasta);
    return this.bitacora
      .filter((bitacora) => {
        const fecha = new Date(bitacora.fecha);
        return fecha >= desdeDate && fecha <= hastaDate;
      })
      .filter(
        (bitacora) => bitacora.mostrar_cliente === this.clienteSeleccionado
      )
      .map((bitacora) => {
        return {
          id: bitacora.id,
          Actividad: bitacora.actividad,
          Codigo_Equipo: bitacora.codigoEquipo,
          Fecha: bitacora.fecha,
          Usuario_crea: bitacora.usuarioCrea,
          Mostrar_cliente: bitacora.mostrar_cliente,
        };
      });
  }

  exportExcel() {
    const desde = (document.getElementById('desde') as HTMLInputElement).value;
    const hasta = (document.getElementById('hasta') as HTMLInputElement).value;
    const filterData = this.filtrarDatos(desde, hasta);
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(filterData);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer, 'Bitácora');
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
