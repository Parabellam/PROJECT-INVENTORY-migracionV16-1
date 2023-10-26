import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Equipo } from 'src/app/models/Equipo';
import { Parametros } from 'src/app/models/Parametros';
import { EquipoServiceService } from 'src/app/services/equipo-service.service';
import { ParametrosService } from 'src/app/services/parametros.service';
import * as AOS from 'aos';
import Swal from 'sweetalert2';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-form-habilitar-equipos',
  templateUrl: './form-habilitar-equipos.component.html',
  styleUrls: ['./form-habilitar-equipos.component.css'],
})
export class FormHabilitarEquiposComponent {
  equipo: Equipo = new Equipo();
  estado: string[] = ['Disponible', 'Asignado', 'De Baja'];
  parametro: Parametros[] = [];
  mostrar: string[] = ['No', 'Si'];
  siguienteCheckboxSeleccionado = false;
  tipo: string[] = ['Equipos', 'Pantallas', 'Dispositvos de Red'];

  private readonly _permissions = {
    permi14heq: '',
  };

  constructor(
    private equipoService: EquipoServiceService,
    private parametrosService: ParametrosService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private titulo: Title,
    private http: HttpClient
  ) {
    titulo.setTitle('Editar Habilitar Equipos');
    const permi14heq = localStorage.getItem('XId5JcLQMLXId5JcLQML');
    const sharedSecret = 'BS5exry0olWCBKABS5exry0olWCBKABS5exry0olWCBKA'; // Generamos la llave para desencriptar
    const permi14heqX = CryptoJS.AES.decrypt(permi14heq, sharedSecret).toString(
      // Desencriptamos
      CryptoJS.enc.Utf8
    );
    if (permi14heq) {
      this._permissions.permi14heq = permi14heqX;
    }
  }

  ngOnInit(): void {
    const id: number = this.activatedRoute.snapshot.params['id'];
    this.equipoService.listarParametrosXid(id).subscribe(
      (data) => {
        this.equipo = data;
      },
      (err) => console.log(err)
    );
    AOS.init();
    this.listarParametros();
  }

  get permissions() {
    return this._permissions;
  }

  onUpdateEquipo(): void {
    if (this.siguienteCheckboxSeleccionado) {
      this.equipo.mostrar = 'No';
      this.equipo.estado = 'Disponible';
    }

    const id = this.activatedRoute.snapshot.params['id'];
    this.equipoService.actualizarEquipo(id, this.equipo).subscribe(
      (data) => {
        Swal.fire({
          position: 'top',
          icon: 'success',
          title: 'Equipo actualizado con éxito',
          showConfirmButton: false,
          timer: 1500,
        });
        this.router.navigate(['/equipos/habilitar']);
      },
      (err) => {
        Swal.fire({
          title: 'Upss, existe un error',
          icon: 'error',
        });
        console.log(err);
      }
    );
  }

  //listar parametros
  listarParametros(): void {
    this.parametrosService.listarParametros().subscribe(
      (data) => {
        this.parametro = data;
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
