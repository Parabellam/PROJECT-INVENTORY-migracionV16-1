import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as Aos from 'aos';
import { Muebles } from 'src/app/models/muebles';
import { MueblesService } from 'src/app/services/muebles.service';
import Swal from 'sweetalert2';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-editar-muebles',
  templateUrl: './editar-muebles.component.html',
  styleUrls: ['./editar-muebles.component.css'],
})
export class EditarMueblesComponent implements OnInit {
  muebles: Muebles = new Muebles();
  mueble: Muebles[] = [];
  estado: string[] = ['Disponible', 'Asignado', 'De Baja'];
  mostrar: string[] = ['No', 'Si'];
  hiddenFile = true;

  // Captar y cambiar estado actual cuando es de baja
  mostraractual: any;
  mostrar2: any;

  private readonly _permissions = {
    permi3mue: '',
  };

  constructor(
    private mueblesService: MueblesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private titulo: Title
  ) {
    titulo.setTitle('Editar Mueble o Enser');
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

  ngOnInit() {
    const id = this.activatedRoute.snapshot.params['id'];
    this.mueblesService.listarParametrosXid(id).subscribe((data) => {
      this.muebles = data;
    });
    Aos.init();
    //No fecha futura
    this.muebles.fecha_factura = new Date();
    this.muebles.fecha_factura.setHours(0, 0, 0, 0);
  }

  get permissions() {
    return this._permissions;
  }

  //No fecha futura
  selectedDate: string;
  currentDate = new Date().toISOString().split('T')[0];
  //No fecha futura
  today = new Date();
  minDate = new Date(
    this.today.getFullYear(),
    this.today.getMonth(),
    this.today.getDate(),
    this.today.getTime()
  );

  //No fecha futura
  updateMinDate() {
    this.minDate = new Date();
    this.minDate.setHours(0, 0, 0, 0);
    if (this.muebles.fecha_factura < this.minDate) {
      this.muebles.fecha_factura = this.minDate;
    }
  }
  onUpdateMuebles(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    if (this.mostraractual != this.mostrar2) {
      // Validar cambio en el drop down De Baja para cambiar estado con seguridad
      this.muebles.estado = 'De Baja';
    }
    this.mueblesService.actualizarMuebles(id, this.muebles).subscribe(
      (data) => {
        Swal.fire({
          position: 'top',
          icon: 'success',
          title: 'Mueble o Enser Actualizado con Éxito',
          showConfirmButton: false,
          timer: 1500,
        });
        this.router.navigate(['/muebles/ver']);
      },
      (err) =>
        Swal.fire({
          title: 'Upss, existe un error',
          icon: 'error',
        })
    );
  }

  fileDescartar(id: any) {
    // Captura cuando será de baja o quitan de baja para cambiar automáticamente el estado
    this.mostraractual = this.muebles.mostrar;
    const value = this.mueble.filter((data) => data.id == id)[0];
    this.mostrar2 = value.mostrar;
  }
}
