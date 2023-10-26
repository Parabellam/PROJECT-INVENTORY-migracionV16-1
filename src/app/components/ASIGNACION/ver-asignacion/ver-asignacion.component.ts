import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import * as Aos from 'aos';
import { Asignacion } from 'src/app/models/Asignacion';
import { Equipo } from 'src/app/models/Equipo';
import { Funcionario } from 'src/app/models/Funcionario';
import { AsignacionService } from 'src/app/services/asignacion.service';
import { EquipoServiceService } from 'src/app/services/equipo-service.service';
import { FuncionarioService } from 'src/app/services/funcionario.service';
import { Accesorio } from 'src/app/models/Accesorio';
import { AccesorioService } from 'src/app/services/accesorio.service';
import { Alquilado } from 'src/app/models/Alquilado';
import { AlquiladoService } from 'src/app/services/alquilado.service';
import * as CryptoJS from 'crypto-js';
import { SedesService } from 'src/app/services/sedes.service';
import { Sede } from 'src/app/models/Sede';

@Component({
  selector: 'app-ver-asignacion',
  templateUrl: './ver-asignacion.component.html',
  styleUrls: ['./ver-asignacion.component.css'],
})
export class VerAsignacionComponent {
  /*** variables */
  asignacion: Asignacion = new Asignacion();
  funcionario: Funcionario[] = [];

  alquilado: Alquilado[] = [];
  equipo: Equipo[] = [];

  sede: Sede[] = [];

  /** types of accessorys */
  accesorio: Accesorio[] = [];

  clienteSeleccionado: string;

  accesoriosSeleccionadosAntes: any[] = [];

  private readonly _permissions = {
    permi1asi: '',
  };

  /** contructor */

  constructor(
    private alquiladoService: AlquiladoService,
    private asignacionService: AsignacionService,
    private funcionarioService: FuncionarioService,
    private equipoService: EquipoServiceService,
    private activatedRoute: ActivatedRoute,
    private accesorioService: AccesorioService,
    private titulo: Title,
    private sedeService: SedesService
  ) {
    titulo.setTitle('Ver Asignación');
    const permi1asi = localStorage.getItem('D49k1gedp6D49k1gedp6');
    const sharedSecret = 'BS5exry0olWCBKABS5exry0olWCBKABS5exry0olWCBKA'; // Generamos la llave para desencriptar
    const permi1asiX = CryptoJS.AES.decrypt(permi1asi, sharedSecret).toString(
      // Desencriptamos
      CryptoJS.enc.Utf8
    );
    if (permi1asi) {
      this._permissions.permi1asi = permi1asiX;
    }
  }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params['id'];
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

    this.asignacionService.listarAsignacionXid(id).subscribe((data) => {
      this.asignacion = data;
      this.accesoriosSeleccionadosAntes = this.asignacion.accesorios;
    });

    /** load the page with the information compleye  */
    Aos.init();
    this.listarFuncionarios();
    this.listarEquipo();
    this.listarAlquilado();
    this.listarAccesorio();
    this.listarSedes();
  }

  get permissions() {
    return this._permissions;
  }

  /* list sedes */
  listarSedes() {
    this.sedeService.listarSede('No').subscribe((data) => {
      this.sede = data.filter(
        (res) =>
          res.mostrar.includes('No') &&
          res.cliente.includes(this.clienteSeleccionado)
      );
    });
  }

  /* list accesorys */
  listarAccesorio() {
    this.accesorioService
      .listarAccesorio('No', this.clienteSeleccionado)
      .subscribe((data) => {
        this.accesorio = data.filter((res) =>
          res.estado.includes('Disponible')
        );
      });
  }

  /** list all officials */
  listarFuncionarios(): void {
    this.funcionarioService
      .listarFuncionarios('No', this.clienteSeleccionado)
      .subscribe(
        (data) => {
          this.funcionario = data;
        },
        (err) => {}
      );
  }

  /*-----------------------listar equipos---------------------------*/
  listarEquipo(): void {
    this.equipoService
      .listarEquipo('No', this.clienteSeleccionado)
      .subscribe((data) => {
        this.equipo = data.filter((f: any) => {
          return f.estado === 'Asignado';
        });
      });
  }

  listarAlquilado(): void {
    this.alquiladoService
      .listarAlquilado('No', this.clienteSeleccionado)
      .subscribe((data) => {
        this.alquilado = data.filter((f: any) => {
          return (
            f.mostrar === 'No' &&
            f.mostrar_cliente === this.clienteSeleccionado &&
            f.estado === 'Asignado'
          );
        });
      });
  }
}
