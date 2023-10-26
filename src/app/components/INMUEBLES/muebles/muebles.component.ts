import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Muebles } from 'src/app/models/muebles';
import { MueblesService } from 'src/app/services/muebles.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-muebles',
  templateUrl: './muebles.component.html',
  styleUrls: ['./muebles.component.css'],
})
export class MueblesComponent implements OnInit {
  filterPost = '';
  muebles: Muebles[] = [];
  public page!: number;
  length: any;
  clienteSeleccionado: string;

  openNewTab(url: string) {
    window.open(url, '_blank');
  }

  private readonly _permissions = {
    permi3mue: '',
  };

  constructor(private mueblesService: MueblesService, private titulo: Title) {
    titulo.setTitle('Muebles y Enseres');
    const permi3mue = localStorage.getItem('JlqmcuqRwfJlqmcuqRwf');
    const sharedSecret = 'BS5exry0olWCBKABS5exry0olWCBKABS5exry0olWCBKA'; // Generamos la llave para desencriptar
    const permi3mueX = CryptoJS.AES.decrypt(permi3mue, sharedSecret).toString(
      // Desencriptamos
      CryptoJS.enc.Utf8
    );
    if (permi3mue) {
      this._permissions.permi3mue = permi3mueX;
    }
  }

  ngOnInit(): void {
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
    this.listarInmuebles();
  }

  get permissions() {
    return this._permissions;
  }

  //listar muebles
  listarInmuebles(): void {
    this.mueblesService.listarMuebles('No', this.clienteSeleccionado).subscribe(
      (data) => {
        this.muebles = data.reverse();
      },
      (err) => {
        console.log(err);
      }
    );
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

  resetPage() {
    this.page = 1;
  }

  /** filter data of files what need in the table */
  filtrarDatos(): any[] {
    return this.muebles
      .filter((muebles) => muebles.mostrar === 'No') // agregar filtro por columna 'mostrar' . Solo exporta los mostrados
      .filter((muebles) => muebles.mostrar_cliente === this.clienteSeleccionado)
      .map((muebles) => {
        return {
          codigo_inmueble: muebles.codigo_inmueble,
          estado: muebles.estado,
          factura: muebles.factura,
          fecha_factura: muebles.fecha_factura,
          observacion: muebles.observacion,
          orden: muebles.orden,
          precio: muebles.precio,
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
      this.saveAsExcelFile(excelBuffer, 'Muebles');
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
