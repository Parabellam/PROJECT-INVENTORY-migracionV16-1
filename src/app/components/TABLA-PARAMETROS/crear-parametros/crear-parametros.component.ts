import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import * as CryptoJS from 'crypto-js';
import { ParametrosService } from 'src/app/services/parametros.service';
import { Parametros } from 'src/app/models/Parametros';
import Swal from 'sweetalert2';
import * as AOS from 'aos';
AOS.init();

@Component({
  selector: 'app-crear-parametros',
  templateUrl: './crear-parametros.component.html',
  styleUrls: ['./crear-parametros.component.css'],
})
export class CrearParametrosComponent implements OnInit {
  parametro: Parametros = new Parametros();
  parametros: Parametros[] = [];
  tipoParametro: string[] = ['03', '04', '01', 'Tipo Dispositivo'];
  private readonly _permissions = {
    permi10gpa: '',
  };

  constructor(
    private parametrosService: ParametrosService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private titulo: Title
  ) {
    titulo.setTitle('Crear Parámetro');
    const permi10gpa = localStorage.getItem('JVPMKbzc0DJVPMKbzc0D');
    const sharedSecret = 'BS5exry0olWCBKABS5exry0olWCBKABS5exry0olWCBKA'; // Generamos la llave para desencriptar
    const permi10gpaX = CryptoJS.AES.decrypt(permi10gpa, sharedSecret).toString(
      // Desencriptamos
      CryptoJS.enc.Utf8
    );
    if (permi10gpa) {
      this._permissions.permi10gpa = permi10gpaX;
    }
  }

  ngOnInit() {
    AOS.init();
    this.listarParametros();
  }

  get permissions() {
    return this._permissions;
  }

  onCreate(): void {
    this.parametrosService.crearParametros(this.parametro).subscribe(
      (data) => {
        Swal.fire({
          position: 'top',
          icon: 'success',
          title: 'Parámetro creado con éxito',
          showConfirmButton: false,
          timer: 1500,
        });
        this.router.navigate(['/parametros/ver']);
      },
      (err) =>
        Swal.fire({
          title: 'Upss, existe un error ',
          icon: 'error',
        })
    );
  }

  listarParametros(): void {
    this.parametrosService.listarParametros().subscribe((data) => {
      this.parametros = data;
    });
  }
}
