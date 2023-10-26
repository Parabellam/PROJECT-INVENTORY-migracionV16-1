import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AlquiladoService } from 'src/app/services/alquilado.service';
import * as AOS from 'aos';
import { Alquilado } from 'src/app/models/Alquilado';
import Swal from 'sweetalert2';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-editar-alquilado',
  templateUrl: './editar-alquilado.component.html',
  styleUrls: ['./editar-alquilado.component.css'],
})
export class EditarAlquiladoComponent {
  estado: string[] = ['Disponible', 'Asignado', 'De Baja'];
  tipoPeriferico: string[] = [
    'Base',
    'Diadema',
    'Teclado',
    'Mouse',
    'Cargador',
  ];
  mostrar: string[] = ['No', 'Si'];
  other: any;
  tipo: any;
  alquilado: Alquilado = new Alquilado();
  alquilados: Alquilado[] = [];
  hiddenFile = true;

  private readonly _permissions = {
    permi2alq: '',
  };

  mostraractual: any;
  mostrar2: any;

  clienteSeleccionado: string = '';

  constructor(
    private alquiladoService: AlquiladoService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private titulo: Title
  ) {
    titulo.setTitle('Editar Alquilado');
    const permi2alq = localStorage.getItem('nWY8Qnp5Y0nWY8Qnp5Y0');
    const sharedSecret = 'BS5exry0olWCBKABS5exry0olWCBKABS5exry0olWCBKA'; // Generamos la llave para desencriptar
    const permi2alqX = CryptoJS.AES.decrypt(permi2alq, sharedSecret).toString(
      // Desencriptamos
      CryptoJS.enc.Utf8
    );
    if (permi2alq) {
      this._permissions.permi2alq = permi2alqX;
    }
  }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.params['id'];
    const clienteSeleccionado = localStorage.getItem(
      '6t9t8gBH896T987t8H0YT796h896979G6RT79g6'
    );
    const sharedSecretCliente =
      'xXry0olWBKA0olBSBKS5eWKASBKABS5eolXWCBA0oWCBKA'; // CLAVE PARA DESENCRIPTAR CLIENTE
    this.clienteSeleccionado = CryptoJS.AES.decrypt(
      clienteSeleccionado,
      sharedSecretCliente
    ).toString(
      // Desencriptamos
      CryptoJS.enc.Utf8
    );
    this.alquiladoService.listarAlquiladoXid(id).subscribe((data) => {
      this.alquilado = data;
    });
    AOS.init();
  }
  //No fecha futura
  currentDate = new Date().toISOString().split('T')[0];
  maxDate: Date;

  updateMaxDate() {
    // No fecha futura
    const fechaDate = new Date(this.alquilado.fecha);
    this.maxDate = new Date();
    this.maxDate.setHours(23, 59, 59, 999);
    if (fechaDate > this.maxDate) {
      this.alquilado.fecha = this.maxDate.toISOString().split('T')[0];
    }
  }

  get permissions() {
    return this._permissions;
  }

  onUpdate(): void {
    if (typeof this.alquilado.precio === 'string') {
      this.alquilado.precio = this.alquilado.precio.replace(/[^0-9]*/g, '');
    }

    if (this.mostraractual != this.mostrar2) {
      this.alquilado.estado = 'De Baja';
    }

    const id = this.activatedRoute.snapshot.params['id'];
    this.alquiladoService.actualizarAlquilado(id, this.alquilado).subscribe(
      (data) => {
        Swal.fire({
          position: 'top',
          icon: 'success',
          title: 'Alquilado Actualizado con Éxito',
          showConfirmButton: false,
          timer: 1500,
        });
        this.router.navigate(['/alquilados/ver']);
      },
      (err) =>
        Swal.fire({
          title: 'Upss, existe un error ',
          icon: 'error',
        })
    );
  }

  fileDescartar(id: any) {
    this.mostraractual = this.alquilado.mostrar;
    const value = this.alquilados.filter((data) => data.id == id)[0];
    this.mostrar2 = value.mostrar;
  }
}
