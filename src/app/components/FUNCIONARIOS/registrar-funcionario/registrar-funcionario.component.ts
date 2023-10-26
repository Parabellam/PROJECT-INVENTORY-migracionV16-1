import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Funcionario } from 'src/app/models/Funcionario';
import { FuncionarioService } from 'src/app/services/funcionario.service';
import Swal from 'sweetalert2';
import * as AOS from 'aos';
import * as CryptoJS from 'crypto-js';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registrar-funcionario',
  templateUrl: './registrar-funcionario.component.html',
  styleUrls: ['./registrar-funcionario.component.css'],
})
export class RegistrarFuncionarioComponent implements OnInit {
  funcionarios: Funcionario = new Funcionario();
  estado: string[] = ['Activo', 'Ausente'];
  mostrar: string[] = ['No', 'Si'];
  hiddenFile = true;
  myForm: FormGroup;
  clienteSeleccionado: string;

  private readonly _permissions = {
    permi5fun: '',
  };

  constructor(
    private funcionarioService: FuncionarioService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private titulo: Title,
    private fb: FormBuilder
  ) {
    titulo.setTitle('Registrar Funcionario');
    const permi5fun = localStorage.getItem('WPfoE59u4JWPfoE59u4J');
    const sharedSecret = 'BS5exry0olWCBKABS5exry0olWCBKABS5exry0olWCBKA'; // Generamos la llave para desencriptar
    const permi5funX = CryptoJS.AES.decrypt(permi5fun, sharedSecret).toString(
      // Desencriptamos
      CryptoJS.enc.Utf8
    );
    if (permi5fun) {
      this._permissions.permi5fun = permi5funX;
    }

    this.myForm = fb.group({
      Documento: ['', Validators.required],
      Nombre: ['', Validators.required],
      Email: ['', Validators.required],
      Celular: ['', Validators.required],
      Observaciones: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    AOS.init();
  }

  get permissions() {
    return this._permissions;
  }

  onCreateFuncionario(): void {
    const fieldsEmpy: string[] = [];

    for (const controlName in this.myForm.controls) {
      const control = this.myForm.get(controlName);

      if (control.hasError('required')) {
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
      this.funcionarios.mostrar_cliente = this.clienteSeleccionado;

      this.funcionarios.estado = 'Activo';
      this.funcionarios.mostrar = 'No';
      this.funcionarioService.crearFuncionarios(this.funcionarios).subscribe(
        (data) => {
          Swal.fire({
            position: 'top',
            icon: 'success',
            title: 'Funcionario Creado con Éxito',
            showConfirmButton: false,
            timer: 1500,
          });
          this.router.navigate(['/funcionarios/ver']);
        },
        (err) =>
          Swal.fire({
            title: 'Upss, existe un error',
            icon: 'error',
          })
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
