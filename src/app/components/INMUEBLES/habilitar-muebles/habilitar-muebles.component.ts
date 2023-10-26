import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Muebles } from 'src/app/models/muebles';
import { MueblesService } from 'src/app/services/muebles.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-habilitar-muebles',
  templateUrl: './habilitar-muebles.component.html',
  styleUrls: ['./habilitar-muebles.component.css'],
})
export class HabilitarMueblesComponent {
  filterPost = '';
  muebles: Muebles[] = [];
  public page!: number;
  mueblesFiltrados: any[];
  public storage: string;
  public username: string;
  clienteSeleccionado: string;

  private readonly _permissions = {
    permi16hmu: '',
  };

  constructor(private mueblesService: MueblesService, private titulo: Title) {
    titulo.setTitle('Muebles Ocultos');
    this.mueblesFiltrados = [];
    const permi16hmu = localStorage.getItem('XOVWi4n21kXOVWi4n21k');
    const sharedSecret = 'BS5exry0olWCBKABS5exry0olWCBKABS5exry0olWCBKA'; // Generamos la llave para desencriptar
    const permi16hmuX = CryptoJS.AES.decrypt(permi16hmu, sharedSecret).toString(
      // Desencriptamos
      CryptoJS.enc.Utf8
    );
    if (permi16hmu) {
      this._permissions.permi16hmu = permi16hmuX;
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

  /* --------------------------- show information if enable --------------------------- */
  listarAccesorio(): void {
    this.mueblesService.listarMuebles('Si', this.clienteSeleccionado).subscribe(
      (data) => {
        this.muebles = data;
        this.muebles.reverse();
        this.mueblesFiltrados = this.muebles.filter((f) => f.mostrar === 'Si');
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
