import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Asignacion } from 'src/app/models/Asignacion';
import { AsignacionService } from 'src/app/services/asignacion.service';
import * as AOS from 'aos';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-asignaciones',
  templateUrl: './asignaciones.component.html',
  styleUrls: ['./asignaciones.component.css'],
})
export class AsignacionesComponent implements OnInit {
  filterPost = '';
  filterPostTipo = '';
  asignacion: Asignacion[] = [];
  public page!: number;
  clienteSeleccionado: string = ''; 

  private readonly _permissions = {
    permi1asi: ''
}

  tipodd: string[] = ['', 'Propio', 'Alquilado']; 

  constructor(
    private asignacionService: AsignacionService,
    private titulo: Title,
    private jwtHelper: JwtHelperService
  ) {
    titulo.setTitle('Asignaciones');
    /**--------------------------------- */

    const permi1asi = localStorage.getItem('D49k1gedp6D49k1gedp6');
    const sharedSecret = 'BS5exry0olWCBKABS5exry0olWCBKABS5exry0olWCBKA'; // CLAVE PARA DESENCRIPTAR PERMISO
    const permi1asiX = CryptoJS.AES.decrypt(permi1asi, sharedSecret).toString(
      // Desencriptamos
      CryptoJS.enc.Utf8
    );
    if (permi1asi) {
      this._permissions.permi1asi
      = permi1asiX;
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
    this.listarAsignacion();
  }

  get permissions() {
    return this._permissions;
  }

  listarAsignacion(): void {
    this.asignacionService
      .listarAsignacion('No', this.clienteSeleccionado)
      .subscribe(
        (data) => {
          this.asignacion = data.reverse();
        },
        (err) => {}
      );
  }

  // Total de Resultados de los 2 filtros
  public getResultsCount(): number {
    let filteredAsignaciones = this.asignacion.filter(
      (item) =>
        (item.sede.includes(this.filterPost) ||
          item.codigo_e_a.includes(this.filterPost) ||
          item.descripcion.includes(this.filterPost) ||
          item.fecha_entrega.includes(this.filterPost) ||
          item.funcionario.nombre.includes(this.filterPost)) &&
        item.tipo.includes(this.filterPostTipo) &&
        item.mostrar_cliente.includes(this.clienteSeleccionado)
    );
    return filteredAsignaciones.length;
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
    return this.asignacion.map((asignacion) => {
      return {
        codigo_equipo: asignacion.codigo_e_a,
        descripcion: asignacion.descripcion,
        tipo: asignacion.tipo,
        fecha_entrega: asignacion.fecha_entrega,
        sede: asignacion.sede,
        nombre_funcionario: asignacion.funcionario.nombre,
        documento_funcionario: asignacion.funcionario.documento,
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
      this.saveAsExcelFile(excelBuffer, 'Asignaciones');
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
