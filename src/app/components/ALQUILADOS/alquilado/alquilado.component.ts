import { Alquilado } from './../../../models/Alquilado';
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import * as AOS from 'aos';
import { AlquiladoService } from 'src/app/services/alquilado.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-alquilado',
  templateUrl: './alquilado.component.html',
  styleUrls: ['./alquilado.component.css'],
})
export class AlquiladoComponent {
  filterPost = '';
  alquilado: Alquilado[] = [];
  mostrar: Alquilado[] = [];
  public page: number;
  public getUser: string;
  public storage: string;
  public username: string;
  length: any;
  clienteSeleccionado: string = '';

  openNewTab(url: string) {
    window.open(url, '_blank');
  }

  private readonly _permissions = {
    permi2alq: '',
  };

  constructor(
    private alquiladoService: AlquiladoService,
    private titulo: Title
  ) {
    titulo.setTitle('Alquilados');

    const permi2alq = localStorage.getItem('nWY8Qnp5Y0nWY8Qnp5Y0');
    const sharedSecret = 'BS5exry0olWCBKABS5exry0olWCBKABS5exry0olWCBKA'; // Generamos la llave para desencriptar
    const permi2alqX = CryptoJS.AES.decrypt(permi2alq, sharedSecret).toString(
      // Desencriptamos
      CryptoJS.enc.Utf8
    );
    if (permi2alq) {
      this._permissions.permi2alq = permi2alqX;
    }
  }


  ngOnInit() {
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
    AOS.init();
    this.listarAlquilado();
  }

  get permissions() {
    return this._permissions;
  }

  listarAlquilado(): void {
    this.alquiladoService
      .listarAlquilado('No', this.clienteSeleccionado)
      .subscribe(
        (data) => {
          this.alquilado = data
            .filter((f: any) => {
              return (
                f.mostrar === 'No' &&
                f.mostrar_cliente === this.clienteSeleccionado
              );
            })
            .reverse();
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
    return this.alquilado.map((alquilado) => {
      return {
        codigo_equipo: alquilado.codigo_equipo,
        descripcion: alquilado.descripcion,
        estado: alquilado.estado,
        fecha: alquilado.fecha,
        precio: alquilado.precio,
      };
    });
  }

  exportExcel() {
    const filterData = this.filtrarDatos();
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(filterData); 
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer, 'Alquilados');
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
