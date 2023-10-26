import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ParametrosService } from 'src/app/services/parametros.service';
import { Parametros } from 'src/app/models/Parametros';
import Swal from 'sweetalert2';
import * as AOS from 'aos';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-editar-parametros',
  templateUrl: './editar-parametros.component.html',
  styleUrls: ['./editar-parametros.component.css'],
})
export class EditarParametrosComponent {
  parametro: Parametros = new Parametros();
  parametros: Parametros[] = [];
  private readonly _permissions = {
    permi10gpa: '',
  };

  constructor(
    private parametrosService: ParametrosService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private titulo: Title
  ) {
    titulo.setTitle('Editar Parámetro');
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
    const id = this.activatedRoute.snapshot.params['id'];
    this.parametrosService.listarParametrosXid(id).subscribe((data) => {
      this.parametro = data;
    });
    AOS.init();
    this.listarParametros();
  }

  get permissions() {
    return this._permissions;
  }

  onUpdate(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    this.parametrosService.actualizarParametros(id, this.parametro).subscribe(
      (data) => {
        Swal.fire({
          position: 'top',
          icon: 'success',
          title: 'Parámetro actualizado con éxito',
          showConfirmButton: false,
          timer: 1500,
        });
        this.router.navigate(['/parametros/ver']);
      },
      (err) => {
        Swal.fire({
          title:
            'Upss, existe un error, "recuerda que el valor debe de ser único ;)" ',
          icon: 'error',
        });
        console.log(err);
      }
    );
  }

  listarParametros(): void {
    this.parametrosService.listarParametros().subscribe(
      (data) => {
        this.parametros = data;
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
