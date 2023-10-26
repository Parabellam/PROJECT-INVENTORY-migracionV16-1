import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import * as AOS from 'aos';
import Swal from 'sweetalert2';
import { Licencia } from 'src/app/models/Licencia';
import { LicenciaService } from 'src/app/services/licencia.service';
import * as CryptoJS from 'crypto-js';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registrar-licencia',
  templateUrl: './registrar-licencia.component.html',
  styleUrls: ['./registrar-licencia.component.css'],
})
export class RegistrarLicenciaComponent {
  licencia: Licencia = new Licencia();
  mostrar: string[] = ['No', 'Si'];
  clienteSeleccionado: string;
  myForm: FormGroup;

  private readonly _permissions = {
    permi6lic: '',
  };

  constructor(
    private licenciaService: LicenciaService,
    private router: Router,
    private titulo: Title,
    private fb: FormBuilder
  ) {
    titulo.setTitle('Crear Licencia');
    const permi6lic = localStorage.getItem('rM3bOFjzeorM3bOFjzeo');
    const sharedSecret = 'BS5exry0olWCBKABS5exry0olWCBKABS5exry0olWCBKA'; // Generamos la llave para desencriptar
    const permi6licX = CryptoJS.AES.decrypt(permi6lic, sharedSecret).toString(
      // Desencriptamos
      CryptoJS.enc.Utf8
    );
    if (permi6lic) {
      this._permissions.permi6lic = permi6licX;
    }

    this.myForm = fb.group({
      Nombre: ['', Validators.required],
      Tipo: ['', Validators.required],
      Version: ['', Validators.required],
      Fabricante: ['', Validators.required],
      Serial: ['', Validators.required],
      Fecha: ['', Validators.required],
      Factura: ['', Validators.required],
      Orden_de_Compra: ['', Validators.required],
      Observaciones: ['', Validators.required],
    });
  }

  ngOnInit() {
    AOS.init();
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
  }

  get permissions() {
    return this._permissions;
  }

  selectedDate: string;
  currentDate = new Date().toISOString().split('T')[0];

  today = new Date();
  minDate = new Date(
    this.today.getFullYear(),
    this.today.getMonth(),
    this.today.getDate()
  );
  updateMinDate() {
    this.minDate = new Date();
    this.minDate.setHours(0, 0, 0, 0);
    /* if (this.equipo.fecha_factura < this.minDate) {
      this.equipo.fecha_factura = this.minDate;
    }*/
  }

  onCreate(): void {
    const fieldsEmpy: string[] = [];

    for (const controlName in this.myForm.controls) {
      const control = this.myForm.get(controlName);

      if (control.hasError('required')) {
        fieldsEmpy.push(controlName);
      }
    }

    if (fieldsEmpy.length === 0 && this.myForm.valid) {
      this.licencia.mostrar = 'No';
      this.licencia.estado = 'Disponible';
      this.licencia.mostrar_cliente = this.clienteSeleccionado;

      this.licenciaService.crearLicencia(this.licencia).subscribe(
        (data) => {
          Swal.fire({
            position: 'top',
            icon: 'success',
            title: 'Licencia creada con éxito',
            showConfirmButton: false,
            timer: 1500,
          });
          this.router.navigate(['/licencias/ver']);
        },
        (err) => {
          Swal.fire({
            title: 'Upss, existe un error ',
            icon: 'error',
          });
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
}
