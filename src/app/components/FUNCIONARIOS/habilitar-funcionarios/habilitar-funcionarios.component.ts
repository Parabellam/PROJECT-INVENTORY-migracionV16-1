import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Funcionario } from 'src/app/models/Funcionario';
import { FuncionarioService } from 'src/app/services/funcionario.service';
import * as AOS from 'aos';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-habilitar-funcionarios',
  templateUrl: './habilitar-funcionarios.component.html',
  styleUrls: ['./habilitar-funcionarios.component.css'],
})
export class HabilitarFuncionariosComponent implements OnInit {
  filterPost = '';
  funcionarios: Funcionario = new Funcionario();
  funcionario: Funcionario[] = [];
  public page!: number;
  funcionariosFiltrados: any[];
  public storage: string;
  public username: string;
  clienteSeleccionado: string;

  private readonly _permissions = {
    permi15hfu: '',
  };

  constructor(
    private funcionarioService: FuncionarioService,
    private titulo: Title
  ) {
    titulo.setTitle('Funcionarios Ocultos');
    this.funcionariosFiltrados = [];
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

  ngOnInit(): void {
    const clienteSeleccionado = localStorage.getItem('6t9t8gBH896T987t8H0YT796h896979G6RT79g6');
    const sharedSecretCliente =
      'xXry0olWBKA0olBSBKS5eWKASBKABS5eolXWCBA0oWCBKA'; // CLAVE PARA DESENCRIPTAR CLIENTE
    this.clienteSeleccionado = CryptoJS.AES.decrypt(
      clienteSeleccionado,
      sharedSecretCliente
    ).toString(
      // Desencriptamos
      CryptoJS.enc.Utf8
    );
    AOS.init();
    this.listarFuncionarios();
  }

  get permissions() {
    return this._permissions;
  }

  listarFuncionarios(): void {
    this.funcionarioService
      .listarFuncionarios('Si', this.clienteSeleccionado)
      .subscribe(
        (data) => {
          this.funcionario = data;
          this.funcionario.reverse();
          this.funcionariosFiltrados = this.funcionario.filter(
            (f) => f.mostrar === 'Si'
          );
        },
        (err) => {}
      );
  }
}
