import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AccesorioService } from 'src/app/services/accesorio.service';
import * as AOS from 'aos';
import { Accesorio } from 'src/app/models/Accesorio';
import Swal from 'sweetalert2';
import * as CryptoJS from 'crypto-js';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registrar-accesorio',
  templateUrl: './registrar-accesorio.component.html',
  styleUrls: ['./registrar-accesorio.component.css'],
})
export class RegistrarAccesorioComponent {
  accesorio: Accesorio = new Accesorio();
  accesorios: Accesorio[] = [];
  estado: string[] = ['Disponible', 'Asignado', 'De baja'];
  tipoPeriferico: string[] = [
    'Base',
    'Diadema',
    'Teclado',
    'Mouse',
    'Cargador',
  ];
  mostrar: string[] = ['No', 'Si'];
  hiddenFile = true;
  other: any;
  tipo: any;
  myForm: FormGroup;
  clienteSeleccionado: string;

  private readonly _permissions = {
    permi7per: '',
  };

  constructor(
    private accesorioService: AccesorioService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private titulo: Title,
    private fb: FormBuilder
  ) {
    titulo.setTitle('Crear Periférico');
    const permi7per = localStorage.getItem('ymwTeYg32iymwTeYg32i');
    const sharedSecret = 'BS5exry0olWCBKABS5exry0olWCBKABS5exry0olWCBKA'; // Generamos la llave para desencriptar
    const permi7perX = CryptoJS.AES.decrypt(permi7per, sharedSecret).toString(
      // Desencriptamos
      CryptoJS.enc.Utf8
    );
    if (permi7per) {
      this._permissions.permi7per = permi7perX;
    }

    this.myForm = fb.group({
      Tipo_de_Periferico: ['', Validators.required],
      Fecha: ['', Validators.required],
      Orden_de_Compra: ['', Validators.required],
      Precio: ['', Validators.required],
      Observaciones: ['', Validators.required],
      Factura: ['', Validators.required],
    });
  }

  ngOnInit() {
    AOS.init();
  }

  //No fecha futura
  currentDate = new Date().toISOString().split('T')[0];
  maxDate: Date;
  updateMaxDate() {
    // No fecha futura
    const fechaDate = new Date(this.accesorio.fecha_factura);
    this.maxDate = new Date();
    this.maxDate.setHours(23, 59, 59, 999);
    if (fechaDate > this.maxDate) {
      this.accesorio.fecha_factura = this.maxDate.toISOString().split('T')[0];
    }
  }

  get permissions() {
    return this._permissions;
  }

  onCreate(): void {
    const fieldsEmpy: string[] = [];

    for (const controlName in this.myForm.controls) {
      const control = this.myForm.get(controlName);
      if (control.hasError('required') ) {
        fieldsEmpy.push(controlName);
      }
    }

    if (fieldsEmpy.length === 0 && this.myForm.valid) {
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
      this.accesorio.mostrar_cliente = this.clienteSeleccionado;
      this.accesorio.estado = 'Disponible';
      this.accesorio.mostrar = 'No';
      this.accesorio.tipo = this.other || this.tipo;
      this.accesorio.precio = this.accesorio.precio.replace(/[^0-9]*/g, '');
      this.accesorioService.crearAccesorio(this.accesorio).subscribe(
        (data) => {
          Swal.fire({
            position: 'top',
            icon: 'success',
            title: 'Periférico creado con éxito',
            showConfirmButton: false,
            timer: 1500,
          });
          this.router.navigate(['/perifericos/ver']);
        },
        (err) => {
          Swal.fire({
            title: 'Upss, existe un error ',
            icon: 'error',
          });
          console.log(err);
        }
      );
    } else {
      const fieldsEmpyMessage = `<h5>Por favor complete los siguientes
      campos obligatorios: ${fieldsEmpy.join(', ')}</h5>`;
      Swal.fire({
        title: fieldsEmpyMessage.replace(/_/g, ' '),
        icon: 'warning',
      });
    }
  }

  convertToNumber(value: string): number {
    const numberValue = parseFloat(value.replace(/,/g, ''));
    return numberValue;
  }
}
