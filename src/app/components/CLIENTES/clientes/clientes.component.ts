import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import * as AOS from 'aos';
import { Cliente } from 'src/app/models/Cliente';
import { ClienteLoginService } from 'src/app/services/cliente-login.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'],
})
export class ClientesComponent {
  /*instanciar la clase cliente como un array para acceder a todos sus datos
  desde un html con el ngFor
  */
  filterPost = '';
  clientes: Cliente[] = [];
  public page: number;
  length: any;

  //item per page
  ipp: number;
  selectedIpp: number = 10;
  ippdd: string[] = ['10', '25', '50', '100'];

  private readonly _permissions = {
    permi9gcl: '',
  };

  //constructor de la clase y sus atributos a utilizar
  constructor(
    private clienteLoginService: ClienteLoginService,
    private titulo: Title
  ) {
    titulo.setTitle('Clientes');

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
  se va a cargar el metodo listarCliente()
  */
  ngOnInit() {
    AOS.init();
    this.listarCliente();
  }

  get permissions() {
    return this._permissions;
  }

  /*metodo que lista todos los clientes de la base de datos conectados
  por medio de los servicios
  */
  listarCliente(): void {
    this.clienteLoginService.listarCliente('No').subscribe(
      (data) => {
        this.clientes = data.reverse();
      },
      (err) => {
        console.log(err);
      }
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
    return this.clientes.map((clientes) => {
      return {
        id: clientes.id,
        nombre: clientes.nombre,
        codigo: clientes.codigo,
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
      this.saveAsExcelFile(excelBuffer, 'Clientes');
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
