import { Muebles } from '../../../models/muebles';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MueblesService } from 'src/app/services/muebles.service';
import Swal from 'sweetalert2';
import * as AOS from 'aos';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-form-habilitar-muebles',
  templateUrl: './form-habilitar-muebles.component.html',
  styleUrls: ['./form-habilitar-muebles.component.css'],
})
export class FormHabilitarMueblesComponent {
  muebles: Muebles = new Muebles();
  estado: string[] = ['Disponible', 'Asignado', 'De Baja'];
  mostrar: string[] = ['No', 'Si'];
  siguienteCheckboxSeleccionado = false;

  private readonly _permissions = {
    permi16hmu: '',
  };

  constructor(
    private mueblesService: MueblesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private titulo: Title
  ) {
    titulo.setTitle('Editar Habilitar Muebles');
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

  ngOnInit() {
    const id = this.activatedRoute.snapshot.params['id'];
    this.mueblesService.listarParametrosXid(id).subscribe((data) => {
      this.muebles = data;
    });
    AOS.init();
  }

  get permissions() {
    return this._permissions;
  }

  onUpdate(): void {
    if (this.siguienteCheckboxSeleccionado) {
      this.muebles.mostrar = 'No';
      this.muebles.estado = 'Disponible';
    }
    /*Esto es para que el valor no pase con los puntos o diferentes caracteres
    a la base de datos a la hora de dar en el botón*/
    this.muebles.precio = this.muebles.precio.replace(/[^0-9]*/g, '');
    const id = this.activatedRoute.snapshot.params['id'];
    this.mueblesService.actualizarMuebles(id, this.muebles).subscribe(
      (data) => {
        Swal.fire({
          position: 'top',
          icon: 'success',
          title: 'Mueble Actualizado con Éxito',
          showConfirmButton: false,
          timer: 1500,
        });
        this.router.navigate(['/muebles/habilitar']);
      },
      (err) =>
        Swal.fire({
          title: 'Upss, existe un error ',
          icon: 'error',
        })
    );
  }
}
