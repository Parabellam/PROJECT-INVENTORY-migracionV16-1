import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as Aos from 'aos';
import { Muebles } from 'src/app/models/muebles';
import { Parametros } from 'src/app/models/Parametros';
import { MueblesService } from 'src/app/services/muebles.service';
import { ParametrosService } from 'src/app/services/parametros.service';
import Swal from 'sweetalert2';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-registrar-muebles',
  templateUrl: './registrar-muebles.component.html',
  styleUrls: ['./registrar-muebles.component.css'],
})
export class RegistrarMueblesComponent implements OnInit {
  muebles: Muebles = new Muebles();
  estado: string[] = ['Disponible', 'ASIGNADO', 'De Baja'];
  mostrar: string[] = ['No', 'Si'];
  parametro: Parametros[] = [];
  _parametro: Parametros = new Parametros();
  filterValue: any;
  id: number;
  hiddenFile = true;

  clienteSeleccionado: string;

  private readonly _permissions = {
    permi3mue: '',
  };

  constructor(
    private mueblesService: MueblesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private titulo: Title,
    private parametrosService: ParametrosService
  ) {
    titulo.setTitle('Registrar Mueble');
    const permi3mue = localStorage.getItem('JlqmcuqRwfJlqmcuqRwf');
    const sharedSecret = 'BS5exry0olWCBKABS5exry0olWCBKABS5exry0olWCBKA'; // Generamos la llave para desencriptar
    const permi3mueX = CryptoJS.AES.decrypt(permi3mue, sharedSecret).toString(
      // Desencriptamos
      CryptoJS.enc.Utf8
    );
    if (permi3mue) {
      this._permissions.permi3mue = permi3mueX;
    }
  }

  ngOnInit(): void {
    this.listarParametros();
    Aos.init();
    this.muebles.fecha_factura = new Date();
    this.muebles.fecha_factura.setHours(0, 0, 0, 0);
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
    if (this.muebles.fecha_factura < this.minDate) {
      this.muebles.fecha_factura = this.minDate;
    }
  }

  get permissions() {
    return this._permissions;
  }

  onCreateInmuebles(): void {
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
    this.muebles.mostrar_cliente = this.clienteSeleccionado;
    this.muebles.estado = 'Disponible';
    this.muebles.mostrar = 'No';
    this.muebles.precio = this.muebles.precio.replace(/[^0-9]*/g, '');
    this.mueblesService.crearMuebles(this.muebles).subscribe(
      (data) => {
        this.parametrosService
          .updateValue(this.filterValue, this.id, this._parametro)
          .subscribe();
        Swal.fire({
          position: 'top',
          icon: 'success',
          title: 'Mueble o Enser Creado con Éxito',
          showConfirmButton: false,
          timer: 1500,
        });
        this.router.navigate(['/muebles/ver']);
      },
      (err) =>
        Swal.fire({
          title: 'Upss, existe un error ',
          icon: 'error',
        })
    );
  }

  //listar los parametros de equipos y de dispositivos
  listarParametros() {
    this.parametrosService.listarParametros().subscribe((data) => {
      this.parametro = data.filter((parametro) =>
        parametro.tipo_parametro.includes('01')
      );
    });
  }

  /**Usa el método filter para filtrar un objeto en un array parametro basado en el
  id que se pasa como argumento a la función.
  Almacena el valor correspondiente al objeto filtrado en la variable value.
  Asigna el valor de value.valor a la variable filterValue.
  Asigna el valor de value.id a la variable id.
  Incrementa filterValue en 1 y lo asigna a filterValue nuevamente.
  Asigna el valor de filterValue a equipo.codigo_equipo.*/
  onFileSelected(id: any) {
    const value = this.parametro.filter((data) => data.id == id)[0];
    this.filterValue = value.valor;
    this.id = value.id;
    this.filterValue = Number(this.filterValue) + 1;
    this.muebles.codigo_inmueble = this.filterValue;
  }
}
