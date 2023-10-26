import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as Aos from 'aos';
import { Funcionario } from 'src/app/models/Funcionario';
import { FuncionarioService } from 'src/app/services/funcionario.service';
import Swal from 'sweetalert2';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-form-habilitar-funcionarios',
  templateUrl: './form-habilitar-funcionarios.component.html',
  styleUrls: ['./form-habilitar-funcionarios.component.css'],
})
export class FormHabilitarFuncionariosComponent implements OnInit {
  funcionarios: Funcionario = new Funcionario();
  funcionario: Funcionario[] = [];
  estado: string[] = ['Activo', 'Inactivo'];
  mostrar: string[] = ['No', 'Si'];
  siguienteCheckboxSeleccionado = false;

  private readonly _permissions = {
    permi15hfu: '',
  };

  constructor(
    private funcionarioService: FuncionarioService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private titulo: Title
  ) {
    titulo.setTitle('Editar Habilitar Funcionario');
    const permi15hfu = localStorage.getItem('nSE7ZxZcxynSE7ZxZcxy');
    const sharedSecret = 'BS5exry0olWCBKABS5exry0olWCBKABS5exry0olWCBKA'; // Generamos la llave para desencriptar
    const permi15hfuX = CryptoJS.AES.decrypt(permi15hfu, sharedSecret).toString(
      // Desencriptamos
      CryptoJS.enc.Utf8
    );
    if (permi15hfu) {
      this._permissions.permi15hfu = permi15hfuX;
    }
  }
  ngOnInit() {
    const id = this.activatedRoute.snapshot.params['id'];
    this.funcionarioService.listarFuncionariosXid(id).subscribe((data) => {
      this.funcionarios = data;
    });
    Aos.init();
  }

  get permissions() {
    return this._permissions;
  }

  onUpdateFuncionario(): void {
    if (this.siguienteCheckboxSeleccionado) {
      this.funcionarios.mostrar = 'No';
      this.funcionarios.estado = 'Activo';
    }
    const id = this.activatedRoute.snapshot.params['id'];
    this.funcionarioService
      .actualizarFuncionarios(id, this.funcionarios)
      .subscribe(
        (data) => {
          Swal.fire({
            position: 'top',
            icon: 'success',
            title: 'Funcionario actualizado con éxito',
            showConfirmButton: false,
            timer: 1500,
          });
          this.router.navigate(['/funcionarios/habilitar']);
        },
        (err) => {
          Swal.fire({
            title: 'Upss, existe un error ',
            icon: 'error',
          });
        }
      );
  }
}
