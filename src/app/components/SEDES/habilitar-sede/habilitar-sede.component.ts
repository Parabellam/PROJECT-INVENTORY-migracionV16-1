import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import * as AOS from 'aos';
import { Cliente } from 'src/app/models/Cliente';
import { Sede } from 'src/app/models/Sede';
import { SedesService } from 'src/app/services/sedes.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-habilitar-sede',
  templateUrl: './habilitar-sede.component.html',
  styleUrls: ['./habilitar-sede.component.css'],
})
export class HabilitarSedeComponent {
  /*instanciar la clase sede como un array para acceder a todos sus datos
  desde un html con el ngFor
  */
  filterPost = '';
  filterPostCL = '';
  sedes: Sede[] = [];
  public page: number;
  sedeFiltrados: any[];
  length: any;

  clienteSeleccionado: string;

  //item per page
  ipp: number;
  selectedIpp: number = 25;
  ippdd: string[] = ['10', '25', '50', '100'];

  private readonly _permissions = {
    permi9gcl: '',
  };

  clientes: Cliente[] = [];

  //constructor de la clase y sus atributos a utilizar
  constructor(private sedeService: SedesService, private titulo: Title) {
    titulo.setTitle('Sedes Ocultas');
    this.sedeFiltrados = [];

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
    this.listarSede();
  }

  get permissions() {
    return this._permissions;
  }

  /*metodo que lista todos los sedes de la base de datos conectados
  por medio de los servicios
  */
  listarSede(): void {
    this.sedeService.listarSede('Si').subscribe(
      (data) => {
        this.sedes = data
          .filter((f: any) => {
            return f.mostrar === 'Si';
          })
          .reverse();
        this.sedeFiltrados = this.sedes.filter((f: any) => {
          return f.mostrar === 'Si';
        });
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

  // Total de Resultados de los 3 filtros
  public getResultsCount(): number {
    let filteredBitacoras = this.sedes.filter(
      (item) =>
        item.nombre.includes(this.filterPost) ||
        item.cliente.includes(this.filterPost)
    );
    return filteredBitacoras.length;
  }
}
