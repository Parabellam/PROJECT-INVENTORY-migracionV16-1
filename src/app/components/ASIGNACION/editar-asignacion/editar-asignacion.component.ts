import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as Aos from 'aos';
import { Asignacion } from 'src/app/models/Asignacion';
import { Equipo } from 'src/app/models/Equipo';
import { Funcionario } from 'src/app/models/Funcionario';
import { AsignacionService } from 'src/app/services/asignacion.service';
import { EquipoServiceService } from 'src/app/services/equipo-service.service';
import { FuncionarioService } from 'src/app/services/funcionario.service';
import Swal from 'sweetalert2';
import { BitacoraService } from 'src/app/services/bitacora.service';
import { Bitacora } from 'src/app/models/Bitacora';
import { Accesorio } from 'src/app/models/Accesorio';
import { AccesorioService } from 'src/app/services/accesorio.service';
import { Alquilado } from 'src/app/models/Alquilado';
import { AlquiladoService } from 'src/app/services/alquilado.service';
import * as CryptoJS from 'crypto-js';
import { Sede } from 'src/app/models/Sede';
import { SedesService } from 'src/app/services/sedes.service';
import { switchMap, mergeMap } from 'rxjs/operators';
import { of, forkJoin } from 'rxjs';
import { concatMap } from 'rxjs/operators';

@Component({
  selector: 'app-editar-asignacion',
  templateUrl: './editar-asignacion.component.html',
  styleUrls: ['./editar-asignacion.component.css'],
})
export class EditarAsignacionComponent implements OnInit {
  /*** variables */
  asignacion: Asignacion = new Asignacion();
  funcionario: Funcionario[] = [];

  alquilado: Alquilado[] = [];
  _alquilado: Alquilado = new Alquilado();
  equipo: Equipo[] = [];
  _equipo: Equipo = new Equipo();

  sede: Sede[] = [];
  mostrar: string[] = ['No', 'Si'];
  parameterValue: any;

  /* Variables condicional bitácora -- *Si no se ha cambiado funcionario o de baja, no generar bitácora* */
  band1: string = '0';
  band2: string = '0';

  /** variables asignacion */
  official: any;
  codigo: any;
  actividad: any;
  fecha: any;

  actualfuncionario: string;

  _bitacora: Bitacora = new Bitacora();

  /** obtener mostrar */
  id: number;
  filterState: any;

  mostraractual: any;
  mostrar2: any;

  /** types of accessorys */
  accesorio: Accesorio[] = [];

  clienteSeleccionado: string;

  accesoriosSeleccionados: any[] = [];
  accesoriosSeleccionadosAntes: any[] = [];

  // Para borrar accesorios asignados
  accesoriosSeleccionadosAntesEliminar: Accesorio[] = [];
  accesoriosSeleccionadosEliminar: any[] = [];
  accesoriosSeleccionadosEstado: any[] = [];

  eliminarAccesoriosEnDevolucion: any[] = [];

  funcionario2: string;

  //Permisos
  private readonly _permissions = {
    permi1asi: '',
  };

  valorAnteriorDescartando: string;

  asignando: number = 0;
  descartando: number = 0;
  cambiandoSede: number = 0;
  validacionEliminar: number = 0;

  sedeAntes: string;
  sedeDespues: string;

  /** contructor */

  constructor(
    private alquiladoService: AlquiladoService,
    private asignacionService: AsignacionService,
    private funcionarioService: FuncionarioService,
    private equipoService: EquipoServiceService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private bitacoraService: BitacoraService,
    private accesorioService: AccesorioService,
    private titulo: Title,
    private sedeService: SedesService
  ) {
    titulo.setTitle('Editar Asignación');
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

    this.asignacionService.listarAsignacionXid(id).subscribe((data) => {
      this.asignacion = data;
      this.sedeAntes = this.asignacion.sede;
      this.accesoriosSeleccionadosAntes = this.asignacion.accesorios; // Guarda los accesorios que ya
      // tiene para concatenar despues con los nuevos en el caso de agregar nuevos
      this.accesoriosSeleccionadosAntesEliminar = this.asignacion.accesorios;

      this.eliminarAccesoriosEnDevolucion =
        this.accesoriosSeleccionadosAntesEliminar;
      this.valorAnteriorDescartando = this.asignacion.mostrar;
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

  eliminarAccesorios() {
    this.validacionEliminar = 1;
  }

  /**get name of the offcials */
  fileFuncionario(id: any) {
    const value = this.funcionario.filter(
      (data) => data.id_funcionario == id
    )[0];
    this.official = value.nombre;
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

  //No fecha futura
  currentDate = new Date().toISOString().split('T')[0];
  maxDate: Date;

  updateMaxDate() {
    // No fecha futura
    const fechaDate = new Date(this.asignacion.fecha_entrega);
    this.maxDate = new Date();
    this.maxDate.setHours(23, 59, 59, 999);
    if (fechaDate > this.maxDate) {
      this.asignacion.fecha_entrega = this.maxDate.toISOString().split('T')[0];
    }
  }

  /** create one new asignement */
  onUpdateAsignacion(): void {
    /** get data by id*/
    const id = this.activatedRoute.snapshot.params['id'];
    this.accesoriosSeleccionados = this.accesoriosSeleccionados.concat(
      // Concatena los accesorios elegidos con los viejos
      this.accesoriosSeleccionadosAntes
    );
    this.asignacion.accesorios = this.accesoriosSeleccionados;

    if (this.asignando == 1) {
      // actualizar el estado de los accesorios a "Asignado" de los nuevos periféricos elegidos
      this.accesoriosSeleccionados.forEach((accesorio) => {
        accesorio.estado = 'Asignado';
        this.accesorioService
          .actualizarAccesorio(accesorio.id, accesorio)
          .subscribe(
            (data) => {},
            (error) => {
              console.error(error);
            }
          );
      });
    }

    if (this.descartando == 1) {
      this.accesoriosSeleccionadosEstado =
        this.accesoriosSeleccionadosAntesEliminar;
    }

    if (this.validacionEliminar == 1 || this.descartando == 1) {
      // actualizar el estado de los accesorios a "Disponible" de los periféricos a eliminar relación
      this.accesoriosSeleccionadosEstado.forEach(
        (accesoriosSeleccionadosAntesEliminar) => {
          accesoriosSeleccionadosAntesEliminar.estado = 'Disponible';
          this.accesorioService
            .actualizarAccesorio(
              accesoriosSeleccionadosAntesEliminar.id,
              accesoriosSeleccionadosAntesEliminar
            )
            .subscribe(
              () => {},
              (error) => {
                console.error(error);
              }
            );
        }
      );
    }

    //saved in bitacora
    this.codigo = this.parameterValue;
    this.fecha = new Date().toISOString().split('T')[0];

    /* Si se da devolución y el equipo es propio, pasa su estado a disponible
    if (this.asignacion.mostrar == 'Si' && this.asignacion.tipo == 'Propio') {
      this.asignacion.equipo.estado = 'Disponible'; //Cambiar estado del equipo al dar Devolución
    } else if (
      //Sino, pasa a Asignado en caso de NO devolución y es propio
      this.asignacion.mostrar == 'No' &&
      this.asignacion.tipo == 'Propio'
    ) {
      this.asignacion.equipo.estado = 'Asignado'; //Sino, no cambiar
    }
    // Si
    if (
      this.mostrar2 !== this.mostraractual &&
      this.asignacion.tipo == 'Alquilado'
    ) {
      this.asignacion.alquilado.estado = 'Disponible'; //Cambiar estado del alquilado al dar Devolución
    } else if (
      this.asignacion.mostrar == 'No' &&
      this.asignacion.tipo == 'Alquilado'
    ) {
      this.asignacion.alquilado.estado = 'Asignado'; //Sino, no cambiar
    }
    if (this.asignacion.tipo == 'Propio') {
      this.filterState = this.asignacion.equipo.estado; // Cambio Estado Propio
    }
    if (this.asignacion.tipo == 'Alquilado') {
      this.filterState = this.asignacion.alquilado.estado; // Cambio Estado Alquilado
    }
    */

    if (this.asignacion.tipo === 'Propio') {
      this.asignacion.equipo.estado =
        this.asignacion.mostrar === 'Si' ? 'Disponible' : 'Asignado';
      this.filterState = this.asignacion.equipo.estado;
    } else if (this.asignacion.tipo === 'Alquilado') {
      if (this.mostrar2 !== this.mostraractual) {
        this.asignacion.alquilado.estado = 'Disponible';
      } else if (this.asignacion.mostrar === 'No') {
        this.asignacion.alquilado.estado = 'Asignado';
      }
      this.filterState = this.asignacion.alquilado.estado;
    }

    /* Validación si hubo cambios en .funcionario */
    if (this.funcionario2 != this.actualfuncionario) {
      this.actividad =
        'Se cambió el equipo del funcionario ' +
        this.actualfuncionario +
        ' al funcionario ' +
        this.funcionario2 +
        ' el día ' +
        this.fecha;
      this.band1 = '6'; //Para validar si hubo cambios en funcionario
    }

    if (this.asignacion.tipo == 'Propio') {
      if (this.mostrar2 != this.mostraractual) {
        //* Validación si hubo cambios en .mostrar (De Baja) en equipos propios*/
        this.actividad =
          'Se descartó la asignación del equipo propio ' +
          this.codigo +
          ' el día ' +
          this.fecha;
        this.band2 = '6'; //Para validar si hubo cambios en de baja propios
      }
    }
    if (this.asignacion.tipo == 'Alquilado') {
      if (this.mostrar2 != this.mostraractual) {
        //* Validación si hubo cambios en .mostrar (De Baja) en equipos alquilados*/
        this.actividad =
          'Se descartó la asignación del equipo alquilado ' +
          this.codigo +
          ' el día ' +
          this.fecha;
        this.band2 = '6'; //Para validar si hubo cambios en de baja alquilados
      }
    }

    const bitacoraCall = (activity: string) => {
      return this.bitacoraService.crearBitacora(
        this._bitacora,
        activity,
        this.codigo,
        this.fecha,
        this.clienteSeleccionado
      );
    };

    /* Validación si hubo cambios en .funcionario, en de baja o en .sede */
    if (this.band1 === '6' || this.band2 === '6' || this.cambiandoSede === 1) {
      of(this.actividad)
        .pipe(
          concatMap((activity) => {
            if (this.band1 === '6') {
              // Para validar si hubo cambios en funcionario
              return bitacoraCall(activity);
            }
            return of(null);
          }),
          concatMap((result) => {
            if (this.band2 === '6') {
              // Para validar si hubo cambios en de baja propios o alquilados
              return bitacoraCall(this.actividad);
            }
            return of(null);
          }),
          concatMap((result) => {
            if (this.cambiandoSede === 1) {
              // Para validar si hubo cambios en .sede y crear bitácora
              this.actividad =
                'Se cambió la sede ' +
                this.sedeAntes +
                ' del equipo ' +
                this.codigo +
                ' el día ' +
                this.fecha +
                ', a la sede ' +
                this.sedeDespues +
                '.';
              return bitacoraCall(this.actividad);
            }
            return of(null);
          })
        )
        .subscribe(
          (data) => {
            this.codigo = this.parameterValue;
          },
          (error) => {
            console.error(error);
          }
        );
    }

    this.id = this.asignacion.id_asignacion;

    this.asignacionService
      .actualizarAsignacion(this.id, this.asignacion)
      .pipe(
        switchMap((data) => {
          const observables = [];

          // Eliminar relaciones
          if (this.validacionEliminar == 1 || this.descartando == 1) {
            const eliminarRelaciones$ =
              this.asignacionService.eliminarRelacionesAsignacionAccesorios(
                this.asignacion.id_asignacion,
                this.accesoriosSeleccionadosEliminar.map(
                  (accesorio) => accesorio.id
                )
              );
            observables.push(eliminarRelaciones$);
          }

          // Actualizar estado
          if (this.asignacion.tipo == 'Alquilado' && this.descartando == 1) {
            this.id = this.asignacion.alquilado.id;
            const updateStateAlquilado$ = this.alquiladoService.updateState(
              this.id,
              this._alquilado,
              this.filterState
            );
            observables.push(updateStateAlquilado$);
          } else if (this.asignacion.tipo == 'Propio') {
            this.id = this.asignacion.equipo.id_equipo;
            const updateStateEquipo$ = this.equipoService.updateState(
              this.id,
              this._equipo,
              this.filterState
            );
            observables.push(updateStateEquipo$);
          }
          // Agregar eliminación de asignación
          if (this.descartando == 1) {
            const eliminarAsignacion$ =
              this.asignacionService.eliminarAsignacion(
                this.asignacion.id_asignacion
              );
            observables.push(eliminarAsignacion$);
          }

          return observables.length > 0 ? forkJoin(observables) : of(null);
        })
      )
      .subscribe(
        (results) => {
          if (results) {
            results.forEach((data, index) => {
              if (index === 0) {
              } else {
              }
            });
          }

          Swal.fire({
            position: 'top',
            icon: 'success',
            title: 'Asignación Actualizada con Éxito',
            showConfirmButton: true,
            timer: 1500,
          }).then(() => {
            this.router.navigate(['/asignaciones/ver']);
          });
        },
        (err) => {
          Swal.fire({
            title: 'Upss, existe un error',
            icon: 'error',
          }).then(() => {});
        }
      );
  }

  /** list all officials */
  listarFuncionarios(): void {
    this.funcionarioService
      .listarFuncionarios('No', this.clienteSeleccionado)
      .subscribe(
        (data) => {
          this.funcionario = data;
        },
        (err) => {
          console.error(err);
        }
      );
  }

  /*-----------------------listar equipos---------------------------*/
  listarEquipo(): void {
    this.equipoService.listarEquipo('No', this.clienteSeleccionado).subscribe(
      (data) => {
        this.equipo = data.filter((f: any) => {
          return f.estado === 'Asignado';
        });
      },
      (error) => {
        console.error(error);
      }
    );
  }

  listarAlquilado(): void {
    this.alquiladoService
      .listarAlquilado('No', this.clienteSeleccionado)
      .subscribe(
        (data) => {
          this.alquilado = data.filter((f: any) => {
            return f.estado === 'Asignado';
          });
        },
        (error) => {
          console.error(error);
        }
      );
  }

  /* list sedes */
  listarSedes() {
    this.sedeService.listarSede('No').subscribe(
      (data) => {
        this.sede = data.filter((f: any) => {
          return f.cliente === this.clienteSeleccionado;
        });
      },
      (error) => {
        console.error(error);
      }
    );
  }

  /**get type parameter */
  fileEquipo(id: any) {
    if (this.asignacion.tipo == 'Propio') {
      const value = this.equipo.filter((data) => data.id_equipo == id)[0];
      if (value) {
        if (this.clienteSeleccionado == 'Nexos') {
          this.parameterValue =
            value.parametros.tipo_parametro + '-0' + value.codigo_equipo;
        }
        if (this.clienteSeleccionado != 'Nexos') {
          this.parameterValue = value.codigo_equipo;
        }
      }
    }
  }

  fileAlquilado(id_alquilado: any) {
    if (this.asignacion.tipo == 'Alquilado') {
      const value = this.alquilado.filter((data) => data.id == id_alquilado)[0];
      if (value) {
        this.parameterValue = value.codigo_equipo;
      }
    }
  }

  fileAsignacion(id: any) {
    this.actualfuncionario = this.asignacion.funcionario.nombre;
    const value = this.funcionario.filter(
      (data) => data.id_funcionario == id
    )[0];
    this.funcionario2 = value.nombre;
  }

  fileDescartar(id: any) {
    this.mostraractual = this.asignacion.mostrar;
    const value = this.funcionario.filter(
      (data) => data.id_funcionario == id
    )[0];
    if (value) {
      this.mostrar2 = value.mostrar;
      this.accesoriosSeleccionadosEliminar =
        this.accesoriosSeleccionadosAntesEliminar;
    }
  }

  asignandoAccesorios() {
    this.asignando = 1;
  }

  cambioSede(sede: any) {
    this.cambiandoSede = 1;
    this.sedeDespues = sede;
  }

  onSelectChange(nuevoValor: string) {
    if (nuevoValor !== this.valorAnteriorDescartando) {
      this.descartando = 1;
    } else {
      this.descartando = 0;
    }
  }
}
