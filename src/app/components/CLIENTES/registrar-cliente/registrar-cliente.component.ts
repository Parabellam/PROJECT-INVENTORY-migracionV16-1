import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import * as AOS from 'aos';
import Swal from 'sweetalert2';
import { Cliente } from 'src/app/models/Cliente';
import { ClienteLoginService } from 'src/app/services/cliente-login.service';
import * as CryptoJS from 'crypto-js';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registrar-cliente',
  templateUrl: './registrar-cliente.component.html',
  styleUrls: ['./registrar-cliente.component.css'],
})
export class RegistrarClienteComponent {
  cliente: Cliente = new Cliente();
  mostrar: string[] = ['No', 'Si'];
  myForm: FormGroup;

  private readonly _permissions = {
    permi9gcl: '',
  };

  constructor(
    private clienteLoginService: ClienteLoginService,
    private router: Router,
    private titulo: Title,
    private fb: FormBuilder
  ) {
    titulo.setTitle('Crear Cliente');
    const permi9gcl = localStorage.getItem('g99XNqkYmJg99XNqkYmJ');
    const sharedSecret = 'BS5exry0olWCBKABS5exry0olWCBKABS5exry0olWCBKA';
    const permi9gclX = CryptoJS.AES.decrypt(permi9gcl, sharedSecret).toString(
      // Desencriptamos
      CryptoJS.enc.Utf8
    );
    if (permi9gcl) {
      this._permissions.permi9gcl = permi9gclX;
    }
    this.myForm = fb.group({
      Nombre: ['', Validators.required],
    });
  }

  ngOnInit() {
    AOS.init();
  }

  get permissions() {
    return this._permissions;
  }

  onCreate(): void {
    const fieldsEmpy: string[] = [];

    for (const controlName in this.myForm.controls) {
      const control = this.myForm.get(controlName);

      if (control.hasError('required') && control.value === '') {
        fieldsEmpy.push(controlName);
      }
    }

    if (fieldsEmpy.length === 0 && this.myForm.valid) {
      this.cliente.mostrar = 'No';
      this.cliente.codigo = this.cliente.nombre;

      this.clienteLoginService.crearCliente(this.cliente).subscribe(
        (data) => {
          Swal.fire({
            position: 'top',
            icon: 'success',
            title: 'Cliente creado con éxito',
            showConfirmButton: false,
            timer: 1500,
          });
          this.router.navigate(['/clientes/ver']);
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
        title: fieldsEmpyMessage,
        icon: 'warning',
      });
    }
  }
}
