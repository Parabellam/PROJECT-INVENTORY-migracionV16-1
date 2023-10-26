import { Accesorio } from '../../../models/Accesorio';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AccesorioService } from 'src/app/services/accesorio.service';
import Swal from 'sweetalert2';
import * as AOS from 'aos';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-form-habilitar-accesorios',
  templateUrl: './form-habilitar-accesorios.component.html',
  styleUrls: ['./form-habilitar-accesorios.component.css'],
})
export class FormHabilitarAccesoriosComponent {
  accesorio: Accesorio = new Accesorio();
  accesorios: Accesorio[] = [];
  estado: string[] = ['Disponible', 'Asignado', 'De Baja'];
  mostrar: string[] = ['No', 'Si'];
  siguienteCheckboxSeleccionado = false;

  private readonly _permissions = {
    permi17hpe: '',
  };

  constructor(
    private accesorioService: AccesorioService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private titulo: Title
  ) {
    titulo.setTitle('Editar Habilitar Periféricos');
    const permi17hpe = localStorage.getItem('a6R1mwqVCXa6R1mwqVCX'); // Traemos el localstorage encriptado
    const sharedSecret = 'BS5exry0olWCBKABS5exry0olWCBKABS5exry0olWCBKA'; // Generamos la llave para desencriptar
    const permi17hpeX = CryptoJS.AES.decrypt(permi17hpe, sharedSecret).toString(
      // Desencriptamos
      CryptoJS.enc.Utf8
    );
    if (permi17hpe) {
      this._permissions.permi17hpe = permi17hpeX; // Se guarda para validar en el html
    }
  }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.params['id'];
    this.accesorioService.listarAccesorioXid(id).subscribe((data) => {
      this.accesorio = data;
    });
    AOS.init();
  }

  get permissions() {
    return this._permissions;
  }

  onUpdate(): void {
    if (this.siguienteCheckboxSeleccionado) {
      this.accesorio.mostrar = 'No';
      this.accesorio.estado = 'Disponible';
    }
    this.accesorio.precio = this.accesorio.precio.replace(/[^0-9]*/g, '');
    const id = this.activatedRoute.snapshot.params['id'];
    this.accesorioService.actualizarAccesorio(id, this.accesorio).subscribe(
      (data) => {
        Swal.fire({
          position: 'top',
          icon: 'success',
          title: 'Periférico actualizado con éxito',
          showConfirmButton: false,
          timer: 1500,
        });
        this.router.navigate(['/perifericos/habilitar']);
      },
      (err) =>
        Swal.fire({
          title: 'Upss, existe un error ',
          icon: 'error',
        })
    );
  }
}
