import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Funcionario } from 'src/app/models/Funcionario';
import { FuncionarioService } from 'src/app/services/funcionario.service';
import Swal from 'sweetalert2';
import * as AOS from 'aos';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-editar-funcionario',
  templateUrl: './editar-funcionario.component.html',
  styleUrls: ['./editar-funcionario.component.css'],
})
export class EditarFuncionarioComponent implements OnInit {
  funcionarios: Funcionario = new Funcionario();
  funcionario: Funcionario[] = [];
  estado: string[] = ['Activo', 'Inactivo'];
  mostrar: string[] = ['No', 'Si'];

  private readonly _permissions = {
    permi5fun: '',
  };

  constructor(
    private funcionarioService: FuncionarioService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private titulo: Title
  ) {
    titulo.setTitle('Editar Funcionario');
    const permi5fun = localStorage.getItem('WPfoE59u4JWPfoE59u4J');
    const sharedSecret = 'BS5exry0olWCBKABS5exry0olWCBKABS5exry0olWCBKA'; // Generamos la llave para desencriptar
    const permi5funX = CryptoJS.AES.decrypt(permi5fun, sharedSecret).toString(
      // Desencriptamos
      CryptoJS.enc.Utf8
    );
    if (permi5fun) {
      this._permissions.permi5fun = permi5funX;
    }
  }
  ngOnInit() {
    const id = this.activatedRoute.snapshot.params['id'];
    this.funcionarioService.listarFuncionariosXid(id).subscribe((data) => {
      this.funcionarios = data;
    });
    AOS.init();
  }

  get permissions() {
    return this._permissions;
  }

  onUpdateFuncionario(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    if (this.funcionarios.mostrar == 'Si') {
      this.funcionarios.estado = 'Inactivo';
    } else {
      this.funcionarios.estado = 'Activo';
    }
    this.funcionarioService
      .actualizarFuncionarios(id, this.funcionarios)
      .subscribe(
        (data) => {
          Swal.fire({
            position: 'top',
            icon: 'success',
            title: 'Funcionario Actualizado con Éxito',
            showConfirmButton: false,
            timer: 1500,
          });
          this.router.navigate(['/funcionarios/ver']);
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
