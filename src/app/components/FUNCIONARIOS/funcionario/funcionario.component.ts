import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Funcionario } from 'src/app/models/Funcionario';
import { FuncionarioService } from 'src/app/services/funcionario.service';
import * as AOS from 'aos';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-funcionario',
  templateUrl: './funcionario.component.html',
  styleUrls: ['./funcionario.component.css'],
})
export class FuncionarioComponent implements OnInit {
  filterPost = '';
  funcionario: Funcionario[] = [];
  public page!: number;
  equiposFiltrados: any[];
  length: any;
  clienteSeleccionado: string;

  private readonly _permissions = {
    permi5fun: '',
  };

  constructor(
    private funcionarioService: FuncionarioService,
    private titulo: Title
  ) {
    titulo.setTitle('Funcionarios');

    const permi5fun = localStorage.getItem('WPfoE59u4JWPfoE59u4J');
    const sharedSecret = 'BS5exry0olWCBKABS5exry0olWCBKABS5exry0olWCBKA'; // Generamos la llave para desencriptar
    const permi5funX = CryptoJS.AES.decrypt(permi5fun, sharedSecret).toString(
      // Desencriptamos
      CryptoJS.enc.Utf8
    );
    if (permi5fun) {
      this._permissions.permi5fun = permi5funX;
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
    this.listarFuncionarios();
  }

  get permissions() {
    return this._permissions;
  }

  listarFuncionarios(): void {
    this.funcionarioService
      .listarFuncionarios('No', this.clienteSeleccionado)
      .subscribe(
        (data) => {
          this.funcionario = data.reverse();
        },
        (err) => {}
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
    return this.funcionario.map((funcionario) => {
      return {
        nombre: funcionario.nombre,
        documento: funcionario.documento,
        celular: funcionario.celular,
        email: funcionario.email,
        estado: funcionario.estado,
        observaciones: funcionario.observaciones,
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
      this.saveAsExcelFile(excelBuffer, 'Funcionarios');
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
