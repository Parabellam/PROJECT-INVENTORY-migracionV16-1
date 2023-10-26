import { AsignacionService } from 'src/app/services/asignacion.service';
import { Asignacion } from 'src/app/models/Asignacion';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as AOS from 'aos';
import { Funcionario } from 'src/app/models/Funcionario';
import { FuncionarioService } from 'src/app/services/funcionario.service';
import { Equipo } from 'src/app/models/Equipo';
import { EquipoServiceService } from 'src/app/services/equipo-service.service';
import { BitacoraService } from 'src/app/services/bitacora.service';
import { Bitacora } from 'src/app/models/Bitacora';
import { Accesorio } from 'src/app/models/Accesorio';
import { AccesorioService } from 'src/app/services/accesorio.service';
import { Sede } from 'src/app/models/Sede';
import { SedesService } from 'src/app/services/sedes.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-registrar-asignacion',
  templateUrl: './registrar-asignacion.component.html',
  styleUrls: ['./registrar-asignacion.component.css'],
})
export class RegistrarAsignacionComponent implements OnInit {
  asignacion: Asignacion = new Asignacion();
  _equipo: Equipo = new Equipo();
  _bitacora: Bitacora = new Bitacora();
  funcionario: Funcionario[] = [];
  funcionariosFiltrados: any[];
  equipo: Equipo[] = [];
  parameterValue: any;
  id: number;
  filterState: any;
  /** variables asignacion */
  official: any;
  codigo: any;
  actividad: any;
  fecha: any;

  /** types of accessorys */
  accesorio: Accesorio[] = [];
  accesorioFiltrados: any[];

  equipo_act: any;

  accesoriosSeleccionados: any[] = [];

  clienteSeleccionado: string;

  private readonly _permissions = {
    permi1asi: '',
  };

  sede: Sede[] = [];

  constructor(
    private asignacionService: AsignacionService,
    private sedeService: SedesService,
    private funcionarioService: FuncionarioService,
    private bitacoraService: BitacoraService,
    private equipoService: EquipoServiceService,
    private accesorioService: AccesorioService,
    private router: Router,
    private titulo: Title
  ) {
    titulo.setTitle('Registrar Asignación');
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

    AOS.init();
    this.listarFuncionarios();
    this.listarEquipo();
    this.listarAccesorio();
    this.listarSedes();
  }

  get permissions() {
    return this._permissions;
  }

  /** control de fechas */
  selectedDate: string;
  currentDate = new Date().toISOString().split('T')[0];

  today = new Date();
  minDate = new Date(
    this.today.getFullYear(),
    this.today.getMonth(),
    this.today.getDate()
  );

  updateMinDate() {
    this.minDate = new Date();
    this.minDate.setHours(0, 0, 0, 0);
  }

  //Filtro para los funcionarios de acuerdo al cliente logeado
  filtroFuncionario(funcionario: any): boolean {
    return funcionario.mostrar_cliente === this.clienteSeleccionado;
  }

  //Filtro para los equipos de acuerdo al cliente logeado
  filtroEquipo(equipo: any): boolean {
    return equipo.mostrar_cliente === this.clienteSeleccionado;
  }

  //Filtro para los accesorios de acuerdo al cliente logeado
  filtroPeriferico(accesorio: any): boolean {
    return accesorio.mostrar_cliente === this.clienteSeleccionado;
  }

  /** create one new asignement */
  onCreateAsignacion(): void {
    /** suscribe and save all data  entered  by user*/
    this.codigo = this._equipo.codigo_equipo;
    this.codigo = this.parameterValue;
    this.asignacion.codigo_e_a = this.codigo;
    this.asignacion.mostrar = 'No';
    this.asignacion.mostrar_cliente = this.clienteSeleccionado;
    this.asignacion.tipo = 'Propio';

    this.asignacionService.crearAsignacion(this.asignacion).subscribe(
      (data) => {
        //saved in bitacora
        this.codigo = this.parameterValue;
        this.asignacion.codigo_e_a = this.codigo;

        this.fecha = new Date().toISOString().split('T')[0];
        this.actividad =
          'Se asignó el equipo ' +
          this.codigo +
          ' el día ' +
          this.fecha +
          ' al funcionario ' +
          this.official;

        //service bitacora
        this.bitacoraService
          .crearBitacora(
            this._bitacora,
            this.actividad,
            this.codigo,
            this.fecha,
            this.clienteSeleccionado
          )
          .subscribe((data) => {});
        //actualizar estado de los equipos a Asignado
        this.equipoService
          .updateState(this.id, this._equipo, this.filterState)
          .subscribe((data) => {});
        // actualizar el estado de los accesorios a "Asignado"
        this.accesoriosSeleccionados.forEach((accesorio) => {
          accesorio.estado = 'Asignado';
          this.accesorioService
            .actualizarAccesorio(accesorio.id, accesorio)
            .subscribe((data) => {});
        });

        Swal.fire({
          position: 'top',
          icon: 'success',
          title: 'Asignación Registrada con Éxito',
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          // aquí puedes hacer algo después de que se muestre el mensaje de éxito
          this.router.navigate(['/asignaciones/ver']);
        });
      },
      (err) => {
        Swal.fire({
          title: 'Upss, existe un error',
          icon: 'error',
        }).then(() => {
          // aquí puedes hacer algo después de que se muestre el mensaje de error
        });
      }
    );
  }

  /** list all officials */
  listarFuncionarios(): void {
    this.funcionarioService
      .listarFuncionarios('No', this.clienteSeleccionado)
      .subscribe(
        (data) => {
          this.funcionario = data.filter((f: any) => {
            return (
              f.mostrar === 'No' &&
              f.mostrar_cliente === this.clienteSeleccionado
            );
          });
          this.funcionariosFiltrados = this.funcionario.filter((f: any) => {
            return (
              f.mostrar === 'No' &&
              f.mostrar_cliente === this.clienteSeleccionado
            );
          });
        },
        (err) => {}
      );
  }

  /*-----------------------listar equipos---------------------------*/
  listarEquipo(): void {
    this.equipoService
      .listarEquipo('No', this.clienteSeleccionado)
      .subscribe((data) => {
        /** organize in order ASC*/
        data.sort(
          (a, b) => parseInt(a.codigo_equipo) - parseInt(b.codigo_equipo)
        );
        this.equipo = data.filter(
          (equipo: Partial<Equipo>) =>
            equipo.mostrar === 'No' &&
            (equipo.estado === 'Disponible' || equipo.estado === undefined) &&
            (equipo.mostrar_cliente === this.clienteSeleccionado ||
              equipo.mostrar_cliente === undefined)
        );
      });
  }

  /* list accesorys */
  listarAccesorio() {
    this.accesorioService
      .listarAccesorio('No', this.clienteSeleccionado)
      .subscribe((data) => {
        this.accesorio = data.filter(
          (res) =>
            res.estado.includes('Disponible') &&
            res.mostrar.includes('No') &&
            res.mostrar_cliente.includes(this.clienteSeleccionado)
        );
      });
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

  /** events for get value in input */

  selectEquipo(id: any) {
    const state = this.equipo.filter((f) => f.id_equipo == id)[0];
    this.equipo_act = '' + this.asignacion.equipo.codigo_equipo;
    this.filterState = state.estado;
    this.filterState = 'Asignado';
    this.id = state.id_equipo;
  }

  /**get name of the offcials */
  fileFuncionario(id: any) {
    const value = this.funcionario.filter(
      (data) => data.id_funcionario == id
    )[0];
    this.official = value.nombre;
  }

  /**get type parameter */
  fileEquipo(id: any) {
    const value = this.equipo.filter((data) => data.id_equipo == id)[0];
    if (this.clienteSeleccionado == 'Nexos') {
      this.parameterValue =
        value.parametros.tipo_parametro + '-0' + value.codigo_equipo;
    }
    if (this.clienteSeleccionado != 'Nexos') {
      this.parameterValue = value.codigo_equipo;
    }
  }
}
