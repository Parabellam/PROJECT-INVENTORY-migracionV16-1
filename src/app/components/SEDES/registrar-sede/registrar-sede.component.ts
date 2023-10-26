import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import * as AOS from 'aos';
import Swal from 'sweetalert2';
import { SedesService } from 'src/app/services/sedes.service';
import { Sede } from 'src/app/models/Sede';
import { Cliente } from 'src/app/models/Cliente';
import { ClienteLoginService } from 'src/app/services/cliente-login.service';
import * as CryptoJS from 'crypto-js';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registrar-sede',
  templateUrl: './registrar-sede.component.html',
  styleUrls: ['./registrar-sede.component.css'],
})
export class RegistrarSedeComponent {
  sede: Sede = new Sede();
  myForm: FormGroup;
  clientes: Cliente[] = [];

  mostrar: string[] = ['No', 'Si'];
  clientesSeleccionados: string; // Drop Down para seleccionar el cliente que va asignado a esa sede

  private readonly _permissions = {
    permi9gcl: '',
  };

  constructor(
    private sedeService: SedesService,
    private clienteService: ClienteLoginService,
    private router: Router,
    private titulo: Title,
    private fb: FormBuilder
  ) {
    titulo.setTitle('Crear Sede');
    const permi9gcl = localStorage.getItem('g99XNqkYmJg99XNqkYmJ');
    const sharedSecret = 'BS5exry0olWCBKABS5exry0olWCBKABS5exry0olWCBKA'; // Generamos la llave para desencriptar
    const permi9gclX = CryptoJS.AES.decrypt(permi9gcl, sharedSecret).toString(
      // Desencriptamos
      CryptoJS.enc.Utf8
    );
    if (permi9gcl) {
      this._permissions.permi9gcl = permi9gclX;
    }

    this.myForm = fb.group({
      Nombre_sede: ['', Validators.required],
      Cliente: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.listarCliente();
    AOS.init();
  }

  get permissions() {
    return this._permissions;
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
      this.sede.mostrar = 'No';
      this.sede.cliente = this.clientesSeleccionados;

      this.sedeService.crearSede(this.sede).subscribe(
        (data) => {
          Swal.fire({
            position: 'top',
            icon: 'success',
            title: 'Sede creada con éxito',
            showConfirmButton: false,
            timer: 1500,
          });
          this.router.navigate(['/sedes/ver']);
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

  listarCliente(): void {
    this.clienteService.listarCliente('No').subscribe((data) => {
      this.clientes = data.filter((res) => res.mostrar.includes('No'));
    });
  }
}
