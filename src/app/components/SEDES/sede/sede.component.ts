import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import * as AOS from 'aos';
import { Cliente } from 'src/app/models/Cliente';
import { Sede } from 'src/app/models/Sede';
import { ClienteLoginService } from 'src/app/services/cliente-login.service';
import { SedesService } from 'src/app/services/sedes.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-sede',
  templateUrl: './sede.component.html',
  styleUrls: ['./sede.component.css'],
})
export class SedeComponent {
  /*instanciar la clase sede como un array para acceder a todos sus datos
  desde un html con el ngFor
  */
  filterPost = '';
  filterPostCL = '';
  sedes: Sede[] = [];
  public page: number;
  length: any;

  //item per page
  ipp: number;
  selectedIpp: number = 10;
  ippdd: string[] = ['10', '25', '50', '100'];

  clientes: Cliente[] = [];
  private readonly _permissions = {
    permi9gcl: '',
  };

  //constructor de la clase y sus atributos a utilizar
  constructor(
    private sedeService: SedesService,
    private clienteService: ClienteLoginService,
    private titulo: Title
  ) {
    titulo.setTitle('Sedes');

    const permi9gcl = localStorage.getItem('g99XNqkYmJg99XNqkYmJ');
    const sharedSecret = 'BS5exry0olWCBKABS5exry0olWCBKABS5exry0olWCBKA'; // Generamos la llave para desencriptar
    const permi9gclX = CryptoJS.AES.decrypt(permi9gcl, sharedSecret).toString(
      // Desencriptamos
      CryptoJS.enc.Utf8
    );
    if (permi9gcl) {
      this._permissions.permi9gcl = permi9gclX;
    }
  }

  /*inicializador de la pagina, significa que, cada que cargue la pagina
  se va a cargar el metodo listarSede()
  */
  ngOnInit() {
    AOS.init();
    this.listarSede();
    this.listarCliente();
  }

  get permissions() {
    return this._permissions;
  }

  /*metodo que lista todos los sedes de la base de datos conectados
  por medio de los servicios
  */
  listarSede(): void {
    this.sedeService.listarSede('No').subscribe(
      (data) => {
        this.sedes = data.reverse();
      },
      (err) => {}
    );
  }

  listarCliente() {
    this.clienteService.listarCliente('No').subscribe((data) => {
      this.clientes = data;
    });
  }

  // Event Click Tamaño Paginación
  ippclick(ipp: any) {
    this.selectedIpp = ipp;
    this.page = 1;
  }

  resetPage() {
    this.page = 1;
  }

  // Total de Resultados de los 3 filtros
  public getResultsCount(): number {
    let filteredBitacoras = this.sedes.filter(
      (item) =>
        (item.nombre.includes(this.filterPost) ||
          item.cliente.includes(this.filterPost)) &&
        item.cliente.includes(this.filterPostCL)
    );
    return filteredBitacoras.length;
  }

  /** filter data of files what need in the table */
  filtrarDatos(): any[] {
    return this.sedes.map((sedes) => {
      return {
        id: sedes.id,
        nombre: sedes.nombre,
        codigo: sedes.cliente,
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
      this.saveAsExcelFile(excelBuffer, 'Sedes');
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
