import { Accesorio } from '../../../models/Accesorio';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AccesorioService } from 'src/app/services/accesorio.service';
import Swal from 'sweetalert2';
import * as AOS from 'aos';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-editar-accesorio',
  templateUrl: './editar-accesorio.component.html',
  styleUrls: ['./editar-accesorio.component.css'],
})
export class EditarAccesorioComponent {
  accesorio: Accesorio = new Accesorio();
  accesorios: Accesorio[] = [];
  estado: string[] = ['Disponible', 'Asignado', 'De Baja'];
  tipoPeriferico: string[] = [
    'Base',
    'Diadema',
    'Teclado',
    'Mouse',
    'Cargador',
  ];
  mostrar: string[] = ['No', 'Si'];
  private _clienteSeleccionado: string = '';

  // Captar y cambiar estado actual cuando es de baja
  mostraractual: any;
  mostrar2: any;

  private readonly _permissions = {
    permi7per: '',
  };

  constructor(
    private accesorioService: AccesorioService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private titulo: Title
  ) {
    titulo.setTitle('Editar Periféricos');
    const permi7per = localStorage.getItem('ymwTeYg32iymwTeYg32i'); // Permiso encriptado
    const sharedSecret = 'BS5exry0olWCBKABS5exry0olWCBKABS5exry0olWCBKA'; // Generamos la llave para desencriptar
    const permi7perX = CryptoJS.AES.decrypt(permi7per, sharedSecret).toString(
      CryptoJS.enc.Utf8
    ); // Permiso desencriptado
    if (permi7per) {
      this._permissions.permi7per = permi7perX; // Se trae su respectivo código guardado en el localstorage y este luego se valida a que tiene acceso este código
    }
  }

  ngOnInit() {
    const clienteSeleccionado = localStorage.getItem('6t9t8gBH896T987t8H0YT796h896979G6RT79g6');
    const sharedSecretCliente =
      'xXry0olWBKA0olBSBKS5eWKASBKABS5eolXWCBA0oWCBKA'; // CLAVE PARA DESENCRIPTAR CLIENTE
    this._clienteSeleccionado = CryptoJS.AES.decrypt(
      clienteSeleccionado,
      sharedSecretCliente
    ).toString(
      // Desencriptamos
      CryptoJS.enc.Utf8
    );
    const id = this.activatedRoute.snapshot.params['id'];
    this.accesorioService.listarAccesorioXid(id).subscribe((data) => {
      this.accesorio = data;
    });
    AOS.init();
  }

  get permissions() {
    return this._permissions;
  }

  public get clienteSeleccionado(): string {
    return this._clienteSeleccionado;
  }


  currentDate = new Date().toISOString().split('T')[0];
  maxDate: Date;

  updateMaxDate() {

    const fechaDate = new Date(this.accesorio.fecha_factura);
    this.maxDate = new Date();
    this.maxDate.setHours(23, 59, 59, 999);
    if (fechaDate > this.maxDate) {
      this.accesorio.fecha_factura = this.maxDate.toISOString().split('T')[0];
    }
  }

  onUpdate(): void {
    this.accesorio.precio = this.accesorio.precio.replace(/[^0-9]*/g, '');
    const id = this.activatedRoute.snapshot.params['id'];
    if (this.mostraractual != this.mostrar2) {
      this.accesorio.estado = 'De Baja';
    }
    this.accesorioService.actualizarAccesorio(id, this.accesorio).subscribe(
      (data) => {
        Swal.fire({
          position: 'top',
          icon: 'success',
          title: 'Periférico Actualizado con Éxito',
          showConfirmButton: false,
          timer: 1500,
        });
        this.router.navigate(['/perifericos/ver']);
      },
      (err) =>
        Swal.fire({
          title: 'Upss, existe un error ',
          icon: 'error',
        })
    );
  }

  fileDescartar(id: any) {
    this.mostraractual = this.accesorio.mostrar;
    const value = this.accesorios.filter((data) => data.id == id)[0];
    this.mostrar2 = value.mostrar;
  }
}
