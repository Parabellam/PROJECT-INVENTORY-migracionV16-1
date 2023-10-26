import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AlquiladoService } from 'src/app/services/alquilado.service';
import * as AOS from 'aos';
import { Alquilado } from 'src/app/models/Alquilado';
import Swal from 'sweetalert2';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-form-habilitar-alquilado',
  templateUrl: './form-habilitar-alquilado.component.html',
  styleUrls: ['./form-habilitar-alquilado.component.css'],
})
export class FormHabilitarAlquiladoComponent {
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
  siguienteCheckboxSeleccionado = false;

  private readonly _permissions = {
    permi12hal: '',
  };

  constructor(
    private alquiladoService: AlquiladoService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private titulo: Title
  ) {
    titulo.setTitle('Editar Alquilado');
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
    const id = this.activatedRoute.snapshot.params['id'];
    this.alquiladoService.listarAlquiladoXid(id).subscribe((data) => {
      this.alquilado = data;
    });
    AOS.init();
  }

  currentDate = new Date().toISOString().split('T')[0];
  maxDate: Date;

  updateMaxDate() {
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
    if (this.siguienteCheckboxSeleccionado) {
      this.alquilado.mostrar = 'No';
      this.alquilado.estado = 'Disponible';
    }
    if (typeof this.alquilado.precio === 'string') {
      this.alquilado.precio = this.alquilado.precio.replace(/[^0-9]*/g, '');
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
        this.router.navigate(['/alquilados/habilitar']);
      },
      (err) =>
        Swal.fire({
          title: 'Upss, existe un error ',
          icon: 'error',
        })
    );
  }
}
