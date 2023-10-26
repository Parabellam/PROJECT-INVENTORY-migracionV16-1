import { Bitacora } from 'src/app/models/Bitacora';
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import * as Aos from 'aos';
import { BitacoraService } from 'src/app/services/bitacora.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-ver-bitacora',
  templateUrl: './ver-bitacora.component.html',
  styleUrls: ['./ver-bitacora.component.css'],
})
export class VerBitacoraComponent {
  bitacoras: Bitacora = new Bitacora();
  bitacora: Bitacora[] = [];
  hiddenFile = true;

  public page!: number;
  public getUser: string;
  public storage: string;
  public username: string;
  bitacoraFiltrados: any[];
  public rol: string;
  isAdmin = false;
  length: any;
  selectedValue: any;

  filterValue: any;
  selectedField: string;
  id: number;

  private readonly _permissions = {
    permi8bit: '',
  };

  clienteSeleccionado: string;

  constructor(
    private bitacoraService: BitacoraService,
    private activatedRoute: ActivatedRoute,
    private titulo: Title
  ) {
    titulo.setTitle('Detalles Bitácora');
    const permi8bit = localStorage.getItem('mF48JmFg48mF48JmFg48');
    const sharedSecret = 'BS5exry0olWCBKABS5exry0olWCBKABS5exry0olWCBKA'; // Generamos la llave para desencriptar
    const permi8bitX = CryptoJS.AES.decrypt(permi8bit, sharedSecret).toString(
      // Desencriptamos
      CryptoJS.enc.Utf8
    );
    if (permi8bit) {
      this._permissions.permi8bit = permi8bitX;
    }
  }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.params['id'];
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
    this.bitacoraService.listarParametrosXid(id).subscribe((data) => {
      this.bitacoras = data;
    });
    Aos.init();
  }

  get permissions() {
    return this._permissions;
  }
}
