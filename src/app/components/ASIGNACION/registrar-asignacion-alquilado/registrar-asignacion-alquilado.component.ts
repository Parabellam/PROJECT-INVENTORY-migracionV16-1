import { AsignacionService } from 'src/app/services/asignacion.service';
import { Asignacion } from 'src/app/models/Asignacion';
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as AOS from 'aos';
import { Funcionario } from 'src/app/models/Funcionario';
import { FuncionarioService } from 'src/app/services/funcionario.service';
import { BitacoraService } from 'src/app/services/bitacora.service';
import { Bitacora } from 'src/app/models/Bitacora';
import { Parametros } from 'src/app/models/Parametros';
import { Accesorio } from 'src/app/models/Accesorio';
import { AccesorioService } from 'src/app/services/accesorio.service';
import { AlquiladoService } from 'src/app/services/alquilado.service';
import { Alquilado } from 'src/app/models/Alquilado';
import { Sede } from 'src/app/models/Sede';
import { SedesService } from 'src/app/services/sedes.service';
import * as CryptoJS from 'crypto-js';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registrar-asignacion-alquilado',
  templateUrl: './registrar-asignacion-alquilado.component.html',
  styleUrls: ['./registrar-asignacion-alquilado.component.css'],
})
export class RegistrarAsignacionAlquiladoComponent {
  asignacion = {
    id_asignacion: 0,
    fecha_entrega: '',
    sede: '',
    mostrar: '',
    mostrar_cliente: '',
    descripcion: '',
    codigo_e_a: '',
    tipo: '',
    funcionario: {
      id_funcionario: 0,
      nombre: '',
      documento: '',
    },
    alquilado: {
      id: 0,
      codigo_equipo: '',
      estado: '',
    },
    accesorios: ([] = []),
  };

  _accesorio: Accesorio = new Accesorio();
  _bitacora: Bitacora = new Bitacora();
  alquilados: Alquilado = new Alquilado();
  funcionario: Funcionario[] = [];
  funcionariosFiltrados: any[];
  asignaciones: Asignacion[] = [];
  _asignaciones: Asignacion = new Asignacion();
  parametro: Parametros[] = [];
  alquilado: Alquilado[] = [];
  parameterValue: any;
  equiposFiltrados: any[];
  orderEquipo: any[];
  estado: String = 'Asignado';
  mostrar: string[] = ['No', 'Si'];
  id: number;
  filterState: any;
  selectedOption: any;
  searchTerm: any;
  /** variables asignacion */
  official: any;
  codigo: any;
  actividad: any;
  fecha: any;
  selectedStates: string[] = [];
  idAccesorio: any;

  /** types of accessorys */
  accesorio: Accesorio[] = [];
  accesorioFiltrados: any[];
  accesorioOption: any[];
  teclado: Accesorio[] = [];
  selectedAccesorios: any[] = [];

  equipo_act: any;

  accesoriosSeleccionados: any[] = [];

  clienteSeleccionado: string;

  private readonly _permissions = {
    permi1asi: '',
  };

  myForm: FormGroup;
  sede: Sede[] = [];

  constructor(
    private asignacionService: AsignacionService,
    private sedeService: SedesService,
    private funcionarioService: FuncionarioService,
    private bitacoraService: BitacoraService,
    private accesorioService: AccesorioService,
    private alquiladoService: AlquiladoService,
    private router: Router,
    private titulo: Title,
    private fb: FormBuilder
  ) {
    titulo.setTitle('Registrar Asignación Alquilado');
    const permi1asi = localStorage.getItem('D49k1gedp6D49k1gedp6');
    const sharedSecret = 'BS5exry0olWCBKABS5exry0olWCBKABS5exry0olWCBKA'; // Generamos la llave para desencriptar
    const permi1asiX = CryptoJS.AES.decrypt(permi1asi, sharedSecret).toString(
      // Desencriptamos
      CryptoJS.enc.Utf8
    );
    if (permi1asi) {
      this._permissions.permi1asi = permi1asiX;
    }

    this.myForm = fb.group({
      Funcionario: ['', Validators.required],
      Equipo: ['', Validators.required],
      Sede: ['', Validators.required],
      Fecha: ['', Validators.required],
      Observaciones: ['', Validators.required],
    });
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
    this.listarAccesorio();
    this.listRenter();
    this.listarSedes();
    this.alquilados.mostrar_cliente = this.clienteSeleccionado;
  }

  get permissions() {
    return this._permissions;
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

  /** create one new asignement */
  onCreateAsignacion(): void {
    const fieldsEmpy: string[] = [];

    for (const controlName in this.myForm.controls) {
      const control = this.myForm.get(controlName);

      if (control.hasError('required') && control.value === '') {
        fieldsEmpy.push(controlName);
      }
    }

    if (fieldsEmpy.length === 0 && this.myForm.valid) {
      this.asignacion.mostrar_cliente = this.clienteSeleccionado;

      /** suscribe and save all data  entered  by user*/
      this.codigo = this.parameterValue;
      this.asignacion.codigo_e_a = this.codigo;
      this.asignacion.mostrar = 'No';
      this.asignacion.tipo = 'Alquilado';
      this.asignacion.mostrar_cliente = this.clienteSeleccionado;

      // actualizar el estado de los accesorios a "Asignado"
      this.accesoriosSeleccionados.forEach((accesorio) => {
        accesorio.estado = 'Asignado';
        this.accesorioService
          .actualizarAccesorio(accesorio.id, accesorio)
          .subscribe((data) => {});
      });

      // Service Asignación
      this.asignacionService.crearAsignacion(this.asignacion).subscribe(
        (data) => {
          this.codigo = this.parameterValue;
          this.asignacion.codigo_e_a = this.codigo;
          this.fecha = new Date().toISOString().split('T')[0];
          //saved in bitacora
          this.actividad =
            'Se asignó el equipo alquilado ' +
            this.codigo +
            ' el día ' +
            this.fecha +
            ' al funcionario ' +
            this.official;

          // Service Bitácora
          this.bitacoraService
            .crearBitacora(
              this._bitacora,
              this.actividad,
              this.codigo,
              this.fecha,
              this.clienteSeleccionado
            )
            .subscribe((data) => {});
          // Service Alquilado
          this.alquiladoService
            .updateState(this.id, this.alquilados, this.filterState)
            .subscribe((data) => {});
          Swal.fire({
            position: 'top',
            icon: 'success',
            title: 'Asignación Registrada con Éxito',
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            this.router.navigate(['/asignaciones/ver']);
          });
        },
        (err) => {
          console.log(err);
          Swal.fire({
            title: 'Upss, existe un error',
            icon: 'error',
          }).then(() => {
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

  /** list all officials */
  listarFuncionarios(): void {
    this.funcionarioService
      .listarFuncionarios('No', this.clienteSeleccionado)
      .subscribe(
        (data) => {
          this.funcionario = data;
          this.funcionariosFiltrados = this.funcionario.filter(
            (f) => f.mostrar === 'No'
          );
        },
        (err) => {
          console.log(err);
        }
      );
  }

  /**get type parameter */
  fileEquipo(id: any) {
    const value = this.alquilado.filter((data) => data.id == id)[0];

    this.parameterValue = value.codigo_equipo;
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

  /** events for get value in input */

  selectEquipo(id: any) {
    const state = this.alquilado.filter((f) => f.id == id)[0];
    this.filterState = state.estado;
    this.filterState = 'Asignado';
    this.id = state.id;
  }

  /**get name of the offcials */
  fileFuncionario(id: any) {
    const value = this.funcionario.filter(
      (data) => data.id_funcionario == id
    )[0];
    this.official = value.nombre;
  }

  newIds: any[] = [];
  tipos: any[] = [];

  /*
  perifericosSeleccionados: number[] = [];
  tiposSeleccionados: String[] = [];

  onSelect2(selectedOptions: any[]) {
    for (const accesorio of selectedOptions) {
      const accesorioId = accesorio.id;
      const accesorioTipo = accesorio.tipo;

      const index2 = this.tiposSeleccionados.indexOf(accesorioTipo);
      if (index2 === -1) {
        // si el elemento no está en el array de periféricos seleccionados, agrégalo
        this.tiposSeleccionados.push(accesorioTipo);
      } else {
        // si el elemento ya está en el array de periféricos seleccionados, elimínalo
        this.tiposSeleccionados.splice(index2, 1);
      }

      const index = this.perifericosSeleccionados.indexOf(accesorioId);
      if (index === -1) {
        // si el elemento no está en el array de periféricos seleccionados, agrégalo
        this.perifericosSeleccionados.push(accesorioId);
      } else {
        // si el elemento ya está en el array de periféricos seleccionados, elimínalo
        this.perifericosSeleccionados.splice(index, 1);
      }
    }
  }
  */

  /**list renter copmputers */
  listRenter() {
    this.alquiladoService
      .listarAlquilado('No', this.clienteSeleccionado)
      .subscribe((data) => {
        // list in order ASC
        data.sort(
          (a, b) => parseFloat(a.codigo_equipo) - parseFloat(b.codigo_equipo)
        );
        this.alquilado = data.filter(
          (alquilado: { estado?: string; mostrar?: string | string[] }) =>
            alquilado.mostrar?.includes('No') &&
            (alquilado.estado === 'Disponible' || !alquilado.estado)
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
}
