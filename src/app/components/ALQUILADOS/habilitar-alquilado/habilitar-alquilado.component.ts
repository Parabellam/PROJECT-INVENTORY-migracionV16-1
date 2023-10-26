import { Alquilado } from './../../../models/Alquilado';
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import * as AOS from 'aos';
import * as CryptoJS from 'crypto-js';
import { AlquiladoService } from 'src/app/services/alquilado.service';

@Component({
  selector: 'app-habilitar-alquilado',
  templateUrl: './habilitar-alquilado.component.html',
  styleUrls: ['./habilitar-alquilado.component.css'],
})
export class HabilitarAlquiladoComponent {
  filterPost = '';
  alquilado: Alquilado[] = [];
  mostrar: Alquilado[] = [];
  public page: number;
  alquiladoFiltrados: any[];
  public storage: string;
  public username: string;
  length: any;
  clienteSeleccionado: string;

  private readonly _permissions = {
    permi12hal: '',
  };

  constructor(
    private alquiladoService: AlquiladoService,
    private titulo: Title
  ) {
    titulo.setTitle('Alquilados Ocultos');
    this.alquiladoFiltrados = [];
    const permi12hal = localStorage.getItem('KxSEsGkmUSKxSEsGkmUS');
    const sharedSecret = 'BS5exry0olWCBKABS5exry0olWCBKABS5exry0olWCBKA'; // Generamos la llave para desencriptar
    const permi12halX = CryptoJS.AES.decrypt(permi12hal, sharedSecret).toString(
      // Desencriptamos
      CryptoJS.enc.Utf8
    );
    if (permi12hal) {
      this._permissions.permi12hal = permi12halX;
    }
  }


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
    this.listarAlquilado();
  }

  get permissions() {
    return this._permissions;
  }


  listarAlquilado(): void {
    this.alquiladoService
      .listarAlquilado('Si', this.clienteSeleccionado)
      .subscribe(
        (data) => {
          this.alquilado = data.filter((f: any) => {
            return (
              f.mostrar === 'Si' &&
              f.mostrar_cliente === this.clienteSeleccionado
            );
          });
          this.alquiladoFiltrados = this.alquilado;
        },
        (err) => {}
      );
  }
}
