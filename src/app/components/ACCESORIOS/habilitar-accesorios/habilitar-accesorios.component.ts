import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AccesorioService } from 'src/app/services/accesorio.service';
import { Accesorio } from 'src/app/models/Accesorio';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-habilitar-accesorios',
  templateUrl: './habilitar-accesorios.component.html',
  styleUrls: ['./habilitar-accesorios.component.css'],
})
export class HabilitarAccesoriosComponent implements OnInit {
  filterPost = '';
  accesorio: Accesorio[] = [];
  mostrar: Accesorio[] = [];
  public page: number;
  accesorioFiltrados: any[];
  public storage: string;
  public username: string;
  equiposFiltrados: any[];
  public rol: string;
  clienteSeleccionado: string;

  private readonly _permissions = {
    permi17hpe: '',
  };

  constructor(
    private accesorioService: AccesorioService,
    private titulo: Title
  ) {
    titulo.setTitle('Periféricos Ocultos');
    this.accesorioFiltrados = [];

    const permi17hpe = localStorage.getItem('a6R1mwqVCXa6R1mwqVCX');
    const sharedSecret = 'BS5exry0olWCBKABS5exry0olWCBKABS5exry0olWCBKA'; // Generamos la llave para desencriptar
    const permi17hpeX = CryptoJS.AES.decrypt(permi17hpe, sharedSecret).toString(
      // Desencriptamos
      CryptoJS.enc.Utf8
    );
    if (permi17hpe) {
      this._permissions.permi17hpe = permi17hpeX; // Se trae su respectivo código guardado en el localstorage y este luego se valida a que tiene acceso este código
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
    this.listarAccesorio();
  }

  get permissions() {
    return this._permissions;
  }

  listarAccesorio(): void {
    this.accesorioService
      .listarAccesorio('Si', this.clienteSeleccionado)
      .subscribe(
        (data) => {
          this.accesorio = data.reverse();
          this.accesorioFiltrados = this.accesorio;
        },
        (err) => {
          console.log(err);
        }
      );
  }
}
