import { EquipoServiceService } from 'src/app/services/equipo-service.service';
import { Equipo } from '../../../models/Equipo';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Parametros } from 'src/app/models/Parametros';
import { ParametrosService } from 'src/app/services/parametros.service';
import { HttpClient } from '@angular/common/http';
import { Bitacora } from 'src/app/models/Bitacora';
import { BitacoraService } from 'src/app/services/bitacora.service';
import { Licencia } from 'src/app/models/Licencia';
import { LicenciaService } from 'src/app/services/licencia.service';
import * as AOS from 'aos';
import * as CryptoJS from 'crypto-js';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registrar-equipo',
  templateUrl: './registrar-equipo.component.html',
  styleUrls: ['./registrar-equipo.component.css'],
})
export class RegistrarEquipoComponent implements OnInit {
  equipo: Equipo = new Equipo();
  _parametros: Parametros = new Parametros();
  equipos: Equipo[] = [];
  parametro: Parametros[] = [];
  filterValue: any;
  selectedField: string;
  cont: number = 1;
  id: number;
  parametroEstado: Parametros[] = [];
  bitacora: Bitacora[] = [];
  _bitacora: Bitacora = new Bitacora();
  actividad: string;
  codigo: string;
  parameterValue: any;
  fecha: any;
  myForm: FormGroup;

  clienteSeleccionado: string;
  licencias: Licencia[] = [];
  licenciasSeleccionados: any[] = [];
  tipo: any[] = [];

  private readonly _permissions = {
    permi4equ: '',
  };

  constructor(
    private equipoService: EquipoServiceService,
    private parametrosService: ParametrosService,
    private licenciaService: LicenciaService,
    private bitacoraService: BitacoraService,
    private router: Router,
    private titulo: Title,
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    titulo.setTitle('Registrar Equipo');
    const permi4equ = localStorage.getItem('RhaYCnBPxwRhaYCnBPxw');
    const sharedSecret = 'BS5exry0olWCBKABS5exry0olWCBKABS5exry0olWCBKA'; // Generamos la llave para desencriptar
    const permi4equX = CryptoJS.AES.decrypt(permi4equ, sharedSecret).toString(
      // Desencriptamos
      CryptoJS.enc.Utf8
    );
    if (permi4equ) {
      this._permissions.permi4equ = permi4equX;
    }

    this.myForm = fb.group({
      Tipo_de_Activo: ['', Validators.required],
      Codigo_Equipo: [''],
      Marca: ['', Validators.required],
      Tipo_de_Dispositivo: ['', Validators.required],
      Modelo: ['', Validators.required],
      Procesador: ['', Validators.required],
      Sistema_Operativo: ['', Validators.required],
      Memoria_RAM: ['', Validators.required],
      Almacenamiento: ['', Validators.required],
      Numero_Factura: ['', Validators.required],
      Serial: ['', Validators.required],
      Precio: ['', Validators.required],
      Orden_de_Compra: ['', Validators.required],
      Fecha_Factura: ['', Validators.required],
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
    this.listarParametros();
    AOS.init();
    this.listarParametroEstado();
    this.listarLicencias();
    this.getTipoParametro();
    /* this.equipo.fecha_factura = new Date();
    this.equipo.fecha_factura.setHours(0, 0, 0, 0);*/
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

  listarLicencias() {
    this.licenciaService
      .listarLicencia('No', this.clienteSeleccionado)
      .subscribe((data) => {
        const nombresUnicos = new Set<string>();
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

  //Filtro para las licencias de acuerdo al cliente logeado y disponibilidad
  filtroLicencia(licencia: any): boolean {
    return (
      licencia.mostrar_cliente === this.clienteSeleccionado &&
      licencia.estado === 'Disponible'
    );
  }

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
    /* if (this.equipo.fecha_factura < this.minDate) {
      this.equipo.fecha_factura = this.minDate;
    }*/
  }

  onCreateEquipo(): void {
    const fieldsEmpy: string[] = [];

    for (const controlName in this.myForm.controls) {
      const control = this.myForm.get(controlName);

      if (control.hasError('required')) {
        fieldsEmpy.push(controlName);
      }
    }

    if (fieldsEmpy.length === 0 && this.myForm.valid) {
      this.equipo.mostrar_cliente = this.clienteSeleccionado;
      this.equipo.estado = 'Disponible';
      this.equipo.mostrar = 'No';

      // actualizar el estado de las licencias a "Asignado"
      this.licenciasSeleccionados.forEach((licencias) => {
        licencias.estado = 'Asignado';
        this.licenciaService
          .actualizarLicencia(licencias.id, licencias)
          .subscribe((data) => {
            licencias.estado = 'Asignado';
          });
      });

      //CREANDO BITÁCORA
      this.fecha = new Date().toISOString().split('T')[0];
      this.equipo.precio = this.equipo.precio.replace(/[^0-9]*/g, ''); //Reemplazar puntos del precio
      this.equipoService.crearEquipo(this.equipo).subscribe(
        (data) => {
          if (this.clienteSeleccionado == 'Nexos') {
            this.codigo = this.parameterValue + '-0' + data.codigo_equipo;
          } else {
            this.codigo = data.codigo_equipo;
          }
          this.actividad =
            'Se registró un nuevo equipo con el código ' +
            this.codigo +
            ' el día ' +
            this.fecha;
          //this service takes care of saved data in of table bitacora
          this.bitacoraService
            .crearBitacora(
              this._bitacora,
              this.actividad,
              this.codigo,
              this.fecha,
              this.clienteSeleccionado
            )
            .subscribe((data) => {});
          //cuando guarde el equipo el valor se actualizara
          this.parametrosService
            .updateValue(this.filterValue, this.id, this._parametros)
            .subscribe((data) => {});
          Swal.fire({
            position: 'top',
            icon: 'success',
            title: 'Equipo Registrado con Éxito',
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            this.router.navigate(['/equipos/ver']);
          });
        },
        (err) => {
          Swal.fire({
            title: 'Upss, existe un error',
            icon: 'error',
          }).then(() => {
            // actualizar el estado de las licencias a "Disponible" en caso de que haya error más abajo
            this.licenciasSeleccionados.forEach((licencias) => {
              licencias.estado = 'Disponible';
              this.licenciaService
                .actualizarLicencia(licencias.id, licencias)
                .subscribe((data) => {
                  licencias.estado = 'Disponible';
                });
            });
          });
        }
      );
    } else {
      const fieldsEmpyMessage = `<h5>Por favor complete los siguientes
    campos obligatorios: ${fieldsEmpy.join(', ')}</h5>`;
      Swal.fire({
        title: fieldsEmpyMessage.replace(/_/g, ' '),
        icon: 'warning',
      });
    }
  }

  //listar los parametros de equipos y de dispositivos
  listarParametros() {
    this.parametrosService.listarParametros().subscribe((data) => {
      this.parametro = data.filter(
        (parametro) =>
          parametro.tipo_parametro.includes('03') ||
          parametro.tipo_parametro.includes('04')
      );
    });
  }

  /**-----------listar los estados ----------------- */
  listarParametroEstado() {
    this.parametrosService.listarParametros().subscribe((data) => {
      this.parametroEstado = data.filter((parametro) =>
        parametro.tipo_parametro.includes('Estado')
      );
    });
  }

  /** the next method, get the value of the table parameters and add 1 as if it were an accountant */
  onFileSelected(id: any) {
    const value = this.parametro.filter((data) => data.id == id)[0];
    this.filterValue = value.valor;
    this.id = value.id;
    this.filterValue = Number(this.filterValue) + 1;
    this.equipo.codigo_equipo = this.filterValue;
  }

  /**get type parameter */
  fileParameter(id: any) {
    const value = this.parametro.filter((data) => data.id == id)[0];
    this.parameterValue = value.tipo_parametro;
  }
}
