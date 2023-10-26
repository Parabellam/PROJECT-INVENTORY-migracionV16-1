import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Equipo } from 'src/app/models/Equipo';
import { Parametros } from 'src/app/models/Parametros';
import { EquipoServiceService } from 'src/app/services/equipo-service.service';
import { ParametrosService } from 'src/app/services/parametros.service';
import * as AOS from 'aos';
import Swal from 'sweetalert2';
import { Bitacora } from 'src/app/models/Bitacora';
import { Licencia } from 'src/app/models/Licencia';
import { LicenciaService } from 'src/app/services/licencia.service';
import * as CryptoJS from 'crypto-js';
import { concatMap, forkJoin, from, switchMap } from 'rxjs';
import { BitacoraService } from 'src/app/services/bitacora.service';

@Component({
  selector: 'app-editar-equipo',
  templateUrl: './editar-equipo.component.html',
  styleUrls: ['./editar-equipo.component.css'],
})
export class EditarEquipoComponent implements OnInit {
  equipo: Equipo = new Equipo();
  equipo2: Equipo[] = [];
  equipos: any;
  estado: string[] = ['Disponible', 'Asignado', 'De Baja'];
  parametro: Parametros[] = [];
  mostrar: string[] = ['No', 'Si'];
  /** bitacora */
  _bitacora: Bitacora = new Bitacora();
  actividad: string;
  codigo: string;
  parameterValue: any;
  fecha: any;

  // Captar y cambiar estado actual cuando es de baja
  mostraractual: any;
  mostrar2: any;

  clienteSeleccionado: string;

  licencias: Licencia[] = [];
  licenciasSeleccionados: any[] = [];
  licenciasSeleccionadosAntes: any[] = [];

  //Para eliminar licencias asignadas
  licenciasSeleccionadosAntesEliminar: any[] = [];
  licenciasSeleccionadosEliminar: any[] = [];
  licenciasSeleccionadosEstado: any[] = [];
  tipo: any[] = [];
  validacionEliminar: number = 0;

  asignando: number = 0;
  isNxs: boolean = false;
  client: string;
  codEquipoBefore: string;

  private readonly _permissions = {
    permi4equ: '',
  };

  constructor(
    private equipoService: EquipoServiceService,
    private parametrosService: ParametrosService,
    private licenciaService: LicenciaService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private titulo: Title,
    private http: HttpClient,
    private bitacoraService: BitacoraService
  ) {
    titulo.setTitle('Editar Equipo');
    const permi4equ = localStorage.getItem('RhaYCnBPxwRhaYCnBPxw');
    const sharedSecret = 'BS5exry0olWCBKABS5exry0olWCBKABS5exry0olWCBKA'; // Generamos la llave para desencriptar
    const permi4equX = CryptoJS.AES.decrypt(permi4equ, sharedSecret).toString(
      // Desencriptamos
      CryptoJS.enc.Utf8
    );
    if (permi4equ) {
      this._permissions.permi4equ = permi4equX;
    }
    this.client = localStorage.getItem('clienteSeleccionadoCodigo');
    if (this.client != 'Nexos') {
      this.isNxs = true;
    }
  }

  ngOnInit(): void {
    const id: number = this.activatedRoute.snapshot.params['id'];
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

    this.equipoService.listarParametrosXid(id).subscribe(
      (data) => {
        this.equipo = data;

        this.codEquipoBefore = this.equipo.codigo_equipo;
        this.licenciasSeleccionadosAntesEliminar = this.equipo.licencias;
        this.licenciasSeleccionadosAntes = this.equipo.licencias;
      },
      (err) => console.log(err)
    );
    AOS.init();
    this.listarParametros();

    this.listarLicencia();
    this.getTipoParametro();
  }

  getTipoParametro() {
    this.parametrosService.listarParametros().subscribe((data: any) => {
      this.tipo = data.filter((res: any) =>
        res.tipo_parametro.includes('Tipo Dispositivo')
      );

    });
  }

  get permissions() {
    return this._permissions;
  }

  //Validar eliminar licencias
  validacionEliminarRelacion() {
    this.validacionEliminar = 1;
  }

  //Filtro para los licencias de acuerdo al cliente logeado
  filtroLicencia(licencias: any): boolean {
    return licencias.mostrar_cliente === this.clienteSeleccionado;
  }

  //No fecha futura
  currentDate = new Date().toISOString().split('T')[0];
  maxDate: Date;

  updateMaxDate() {
    // No fecha futura
    const fechaDate = new Date(this.equipo.fecha_factura);
    this.maxDate = new Date();
    this.maxDate.setHours(23, 59, 59, 999);
    if (fechaDate > this.maxDate) {
      this.equipo.fecha_factura = this.maxDate.toISOString().split('T')[0];
    }
  }

  //Validación para entrar al if de concatenar y asignar licencias
  asignandoLicencias() {
    this.asignando = 1;
  }

  saveBitacora(
    bitacora: any,
    actividad: string,
    codigo: string,
    fecha: any,
    cliente: string
  ) {
    this.bitacoraService
      .crearBitacora(bitacora, actividad, codigo, fecha, cliente)
      .subscribe(() => {});
  }

  onUpdateEquipo(): void {
    this.fecha = new Date().toISOString().split('T')[0];
    const id = this.activatedRoute.snapshot.params['id'];
    if (this.mostrar2 != this.mostraractual) {
      this.equipo.estado = 'De Baja';
    }

    //Validación si el cliente selecciona una licencia para asignar
    if (this.asignando == 1) {
      //Se concatenan las licencias seleccionadas con las que ya tiene
      this.licenciasSeleccionados = this.licenciasSeleccionados.concat(
        this.licenciasSeleccionadosAntes
      );
      this.equipo.licencias = this.licenciasSeleccionados;

      // actualizar el estado de los licencias a "Asignado"
      this.licenciasSeleccionados.forEach((licencia) => {
        licencia.estado = 'Asignado';
        this.licenciaService
          .actualizarLicencia(licencia.id, licencia)
          .subscribe((data) => {});
      });
    }

    if (this.validacionEliminar == 1) {
      // actualizar el estado de los accesorios a "Disponible" de los periféricos a eliminar relación
      this.licenciasSeleccionadosEstado.forEach(
        (accesoriosSeleccionadosAntesEliminar) => {
          accesoriosSeleccionadosAntesEliminar.estado = 'Disponible';
          this.licenciaService
            .actualizarLicencia(
              accesoriosSeleccionadosAntesEliminar.id,
              accesoriosSeleccionadosAntesEliminar
            )
            .subscribe((data) => {});
        }
      );
    }

    this.equipoService.actualizarEquipo(id, this.equipo).subscribe(
      (data) => {
        if (this.validacionEliminar == 1) {
          const idEquipo = this.equipo.id_equipo;
          const source = from(this.licenciasSeleccionadosEliminar);

          // Usar concatMap para hacer las solicitudes de manera secuencial
          source
            .pipe(
              concatMap((elemento) =>
                this.equipoService.eliminarRelacion(idEquipo, elemento.id)
              )
            )
            .subscribe(() => {});
        }

        if (this.equipo.codigo_equipo != this.codEquipoBefore) {
          if (this.clienteSeleccionado != 'Nexos') {
            this.codigo = data.codigo_equipo;
            const actividad = `Se actualizo el código de equipo ${this.codEquipoBefore} a ${this.codigo} el dia ${this.fecha}`;
            this.saveBitacora(
              this._bitacora,
              actividad,
              this.codigo,
              this.fecha,
              this.clienteSeleccionado
            );
          }
        }

        if (this.equipo.mostrar === 'Si') {
          if (this.clienteSeleccionado === 'Nexos') {
            this.codigo =
              data.parametros.tipo_parametro + '-0' + data.codigo_equipo;
          } else {
            this.codigo = data.codigo_equipo;
          }
          const actividad = `Se dio de baja el equipo con el código ${this.codigo} el dia ${this.fecha}`;
          this.saveBitacora(
            this._bitacora,
            actividad,
            this.codigo,
            this.fecha,
            this.clienteSeleccionado
          );
        }

        Swal.fire({
          position: 'top',
          icon: 'success',
          title: 'Equipo Actualizado con Éxito',
          showConfirmButton: false,
          timer: 1500,
        });
        this.router.navigate(['/equipos/ver']);
      },
      (err) => {
        Swal.fire({
          title: 'Upss, existe un error',
          icon: 'error',
        });
      }
    );
  }

  listarLicencia() {
    this.licenciaService
      .listarLicencia('No', this.clienteSeleccionado)
      .subscribe((data) => {
        const nombresUnicos = new Set<string>();
        this.licenciasSeleccionadosAntes.forEach((licencia: any) => {
          const nombreTransformado = licencia.nombre
            .trim()
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
          nombresUnicos.add(nombreTransformado);
        });

        this.licencias = data.filter((licencia: any) => {
          if (licencia.estado === 'Disponible') {
            const nombreTransformado = licencia.nombre
              .trim()
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '');

            if (!nombresUnicos.has(nombreTransformado)) {
              nombresUnicos.add(nombreTransformado);
              return true;
            }
          }
          return false;
        });
      });
  }

  //listar parametros
  listarParametros(): void {
    this.parametrosService.listarParametros().subscribe(
      (data) => {
        this.parametro = data;
      },
      (err) => {}
    );
  }

  getObservation(observacion: string) {
    this.actividad = observacion;
  }

  fileDescartar(id_equipo: any) {
    // Captura cuando será de baja o quitan de baja para cambiar automáticamente el estado
    this.mostraractual = this.equipo.mostrar;
    const value = this.equipo2.filter((data) => data.id_equipo == id_equipo)[0];
    this.mostrar2 = value.mostrar;
  }
}
