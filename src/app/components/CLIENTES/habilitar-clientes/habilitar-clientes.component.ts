import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import * as AOS from 'aos';
import { Cliente } from 'src/app/models/Cliente';
import { ClienteLoginService } from 'src/app/services/cliente-login.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-habilitar-clientes',
  templateUrl: './habilitar-clientes.component.html',
  styleUrls: ['./habilitar-clientes.component.css'],
})
export class HabilitarClientesComponent {
  /*instanciar la clase cliente como un array para acceder a todos sus datos
  desde un html con el ngFor
  */
  filterPost = '';
  clientes: Cliente[] = [];
  public page: number;
  clienteFiltrados: any[];
  public storage: string;
  public username: string;
  length: any;
  clienteSeleccionado: string;

  //item per page
  ipp: number;
  selectedIpp: number = 10;
  ippdd: string[] = ['10', '25', '50', '100'];

  private readonly _permissions = {
    permi13hcl: '',
  };

  //constructor de la clase y sus atributos a utilizar
  constructor(
    private clienteLoginService: ClienteLoginService,
    private titulo: Title
  ) {
    titulo.setTitle('Clientes');
    this.clienteFiltrados = [];

    const permi13hcl = localStorage.getItem('rVogPpaDKGrVogPpaDKG');
    const sharedSecret = 'BS5exry0olWCBKABS5exry0olWCBKABS5exry0olWCBKA'; // Generamos la llave para desencriptar
    const permi13hclX = CryptoJS.AES.decrypt(permi13hcl, sharedSecret).toString(
      // Desencriptamos
      CryptoJS.enc.Utf8
    );
    if (permi13hcl) {
      this._permissions.permi13hcl = permi13hclX;
    }
  }

  /*inicializador de la pagina, significa que, cada que cargue la pagina
  se va a cargar el metodo listarCliente()
  */
  ngOnInit() {
    const clienteSeleccionado = localStorage.getItem('6t9t8gBH896T987t8H0YT796h896979G6RT79g6');
    if (clienteSeleccionado) {
      this.clienteSeleccionado = clienteSeleccionado;
    }
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
    this.clienteLoginService.listarCliente('Si').subscribe(
      (data) => {
        this.clientes = data.filter((f: any) => {
          return f.mostrar === 'Si';
        });
        this.clienteFiltrados = this.clientes.filter((f: any) => {
          return f.mostrar === 'Si';
        });
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
}
