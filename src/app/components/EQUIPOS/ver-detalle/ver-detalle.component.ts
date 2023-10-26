import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as Aos from 'aos';
import { Equipo } from 'src/app/models/Equipo';
import { Parametros } from 'src/app/models/Parametros';
import { EquipoServiceService } from 'src/app/services/equipo-service.service';
import { ParametrosService } from 'src/app/services/parametros.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-ver-detalle',
  templateUrl: './ver-detalle.component.html',
  styleUrls: ['./ver-detalle.component.css'],
})
export class VerDetalleComponent implements OnInit {
  equipo: Equipo = new Equipo();
  estado: string[] = ['Disponible', 'Asignado', 'De Baja'];
  parametro: Parametros[] = [];
  mostrar: String[] = ['No', 'Si'];
  tipo: string[] = ['Equipos', 'Pantallas', 'Dispositvos de Red'];
  permi4equ: string;

  clienteSeleccionado: string;

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
    const id: number = this.activatedRoute.snapshot.params['id'];
    this.equipoService.listarParametrosXid(id).subscribe(
      (data) => {
        this.equipo = data;
      },
      (err) => console.log(err)
    );
    Aos.init();
    this.listarParametros();
  }

  constructor(
    private equipoService: EquipoServiceService,
    private parametrosService: ParametrosService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private titulo: Title
  ) {
    titulo.setTitle('Detalles Equipo');
    const permi4equ = localStorage.getItem('RhaYCnBPxwRhaYCnBPxw');
    const sharedSecret = 'BS5exry0olWCBKABS5exry0olWCBKABS5exry0olWCBKA'; // Generamos la llave para desencriptar
    const permi4equX = CryptoJS.AES.decrypt(permi4equ, sharedSecret).toString(
      // Desencriptamos
      CryptoJS.enc.Utf8
    );
    if (permi4equ) {
      this.permi4equ = permi4equX;
    }
  }

  //listar parametros
  listarParametros(): void {
    this.parametrosService.listarParametros().subscribe(
      (data) => {
        this.parametro = data;
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
