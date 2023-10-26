import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AccesorioService } from 'src/app/services/accesorio.service';
import { Accesorio } from 'src/app/models/Accesorio';
import * as AOS from 'aos';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-accesorio',
  templateUrl: './accesorio.component.html',
  styleUrls: ['./accesorio.component.css'],
})
export class AccesorioComponent implements OnInit {
  filterPost = '';
  accesorio: Accesorio[] = [];
  mostrar: Accesorio[] = [];
  public page: number;
  length: any;
  private _clienteSeleccionado: string = '';

  ipp: number;
  selectedIpp: number = 10;
  ippdd: string[] = ['10', '25', '50', '100'];

  openNewTab(url: string) {
    window.open(url, '_blank');
  }

  private readonly _permissions = {
    permi7per: '',
  };

  constructor(
    private accesorioService: AccesorioService,
    private titulo: Title,
    private jwtHelper: JwtHelperService
  ) {
    titulo.setTitle('Periféricos');

    const permi7per = localStorage.getItem('ymwTeYg32iymwTeYg32i'); // Permiso encriptado
    const sharedSecret = 'BS5exry0olWCBKABS5exry0olWCBKABS5exry0olWCBKA';
    const permi7perX = CryptoJS.AES.decrypt(permi7per, sharedSecret).toString(
      CryptoJS.enc.Utf8
    ); // Permiso desencriptado
    if (permi7per) {
      this._permissions.permi7per = permi7perX; // Se trae su respectivo código guardado en el localstorage y este luego se valida a que tiene acceso este código
    }
  }


  ngOnInit() {
    const clienteSeleccionado = localStorage.getItem('6t9t8gBH896T987t8H0YT796h896979G6RT79g6');
    const sharedSecretCliente =
      'xXry0olWBKA0olBSBKS5eWKASBKABS5eolXWCBA0oWCBKA'; // CLAVE PARA DESENCRIPTAR CLIENTE
    this._clienteSeleccionado = CryptoJS.AES.decrypt(
      clienteSeleccionado,
      sharedSecretCliente
    ).toString(
      // Desencriptamos
      CryptoJS.enc.Utf8
    );

    AOS.init();
    this.listarAccesorio();
  }

  get permissions() {
    return this._permissions;
  }

  public get clienteSeleccionado(): string {
    return this._clienteSeleccionado;
  }


  listarAccesorio(): void {
    this.accesorioService
      .listarAccesorio('No', this.clienteSeleccionado)
      .subscribe(
        (data) => {
          this.accesorio = data.reverse();
        },
        (err) => {}
      );
  }

  // Event Click Tamaño Paginación
  ippclick(ipp: any) {
    this.selectedIpp = ipp;
    this.page = 1;
  }

  resetPage() {
    this.page = 1;
  }

  /** filter data of files what need in the table */
  filtrarDatos(): any[] {
    return this.accesorio.map((accesorio) => {
      return {
        tipo_periferico: accesorio.tipo,
        precio: accesorio.precio,
        orden_de_compra: accesorio.orden,
        factura: accesorio.factura,
        fecha_factura: accesorio.fecha_factura,
        estado: accesorio.estado,
        observaciones: accesorio.observaciones,
      };
    });
  }

  exportExcel() {
    const filterData = this.filtrarDatos();
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(filterData); // Sale Data
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer, 'Periféricos');
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
