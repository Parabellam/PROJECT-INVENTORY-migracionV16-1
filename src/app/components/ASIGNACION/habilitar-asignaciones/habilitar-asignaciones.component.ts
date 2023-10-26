import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import * as Aos from 'aos';
import { Asignacion } from 'src/app/models/Asignacion';
import { AsignacionService } from 'src/app/services/asignacion.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-habilitar-asignaciones',
  templateUrl: './habilitar-asignaciones.component.html',
  styleUrls: ['./habilitar-asignaciones.component.css'],
})
export class HabilitarAsignacionesComponent {
  filterPost = '';
  asignacion: Asignacion[] = [];
  public page!: number;
  accesorioFiltrados: any[];
  asignacionesFiltrados: any[];
  clienteSeleccionado: string;

  permi1asi: string;

  constructor(
    private asignacionService: AsignacionService,
    private titulo: Title
  ) {
    titulo.setTitle('Asignaciones');
    this.asignacionesFiltrados = [];
    const permi1asi = localStorage.getItem('D49k1gedp6D49k1gedp6');
    const sharedSecret = 'BS5exry0olWCBKABS5exry0olWCBKABS5exry0olWCBKA'; // Generamos la llave para desencriptar
    const permi1asiX = CryptoJS.AES.decrypt(permi1asi, sharedSecret).toString(
      // Desencriptamos
      CryptoJS.enc.Utf8
    );
    if (permi1asi) {
      this.permi1asi = permi1asiX;
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
    Aos.init();
    this.listarAsignacion();
  }

  listarAsignacion(): void {
    this.asignacionService
      .listarAsignacion('Si', this.clienteSeleccionado)
      .subscribe((data) => {
        this.asignacion = data.filter((f) => f.mostrar === 'Si').reverse();
        this.asignacionesFiltrados = this.asignacion;
      });
  }
}
