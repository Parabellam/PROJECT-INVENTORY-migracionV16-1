import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Equipo } from '../../../models/Equipo';
import { EquipoServiceService } from 'src/app/services/equipo-service.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-habilitar-equipos',
  templateUrl: './habilitar-equipos.component.html',
  styleUrls: ['./habilitar-equipos.component.css'],
})
export class HabilitarEquiposComponent {
  filterPost = '';
  mostrar: Equipo[] = [];
  public page!: number;
  teams: any;
  public storage: string;
  public username: string;
  equiposFiltrados: any[];

  clienteSeleccionado: string;

  private readonly _permissions = {
    permi14heq: '',
  };

  constructor(
    private equipoService: EquipoServiceService,
    private titulo: Title
  ) {
    titulo.setTitle('Equipos Ocultos');
    this.equiposFiltrados = [];

    const permi14heq = localStorage.getItem('XId5JcLQMLXId5JcLQML');
    const sharedSecret = 'BS5exry0olWCBKABS5exry0olWCBKABS5exry0olWCBKA'; // Generamos la llave para desencriptar
    const permi14heqX = CryptoJS.AES.decrypt(permi14heq, sharedSecret).toString(
      // Desencriptamos
      CryptoJS.enc.Utf8
    );
    if (permi14heq) {
      this._permissions.permi14heq = permi14heqX;
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
    this.listarEquipo();
  }

  get permissions() {
    return this._permissions;
  }

  /* --------------------------- show information if enable --------------------------- */
  listarEquipo(): void {
    this.equipoService
      .listarEquipo('Si', this.clienteSeleccionado)
      .subscribe((data) => {
        this.teams = data;
        this.equiposFiltrados = this.teams
          .filter((f: { mostrar: string }) => f.mostrar === 'Si')
          .reverse();
      });
  }
}
