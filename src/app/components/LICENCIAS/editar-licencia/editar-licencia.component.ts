import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import * as AOS from 'aos';
import Swal from 'sweetalert2';
import { Licencia } from 'src/app/models/Licencia';
import { LicenciaService } from 'src/app/services/licencia.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-editar-licencia',
  templateUrl: './editar-licencia.component.html',
  styleUrls: ['./editar-licencia.component.css'],
})
export class EditarLicenciaComponent {
  licencia: Licencia = new Licencia();
  licencias: Licencia[] = [];
  mostrar: string[] = ['No', 'Si'];
  other: any;
  tipo: any;

  clienteSeleccionado: string;
  licenciasEquipos: any[] = [];
  idgay: number;

  id: number;

  private readonly _permissions = {
    permi6lic: '',
  };

  constructor(
    private licenciaService: LicenciaService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private titulo: Title
  ) {
    titulo.setTitle('Editar Licencia');
    const permi6lic = localStorage.getItem('rM3bOFjzeorM3bOFjzeo');
    const sharedSecret = 'BS5exry0olWCBKABS5exry0olWCBKABS5exry0olWCBKA'; // Generamos la llave para desencriptar
    const permi6licX = CryptoJS.AES.decrypt(permi6lic, sharedSecret).toString(
      // Desencriptamos
      CryptoJS.enc.Utf8
    );
    if (permi6lic) {
      this._permissions.permi6lic = permi6licX;
    }
  }

  ngOnInit() {
    Promise.all([this.identificarCliente()]).then(() => {
      Promise.all([this.listarLicenciaXid()]).then(() => {
        Promise.all([this.listarLicenciaEquipo()]).then(() => {
          AOS.init();
        });
      });
    });
  }

  listarLicenciaEquipo(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.licenciaService.listarLicenciaEquipo().subscribe((data: any) => {
        this.licenciasEquipos = data.filter((f: any) => {
          return (
            f.mostrar === 'No' &&
            f.mostrar_cliente === this.clienteSeleccionado &&
            f.id === this.idgay // Lista el equipo al que está asignada la licencia
          );
        });
      });
      resolve();
    });
  }

  listarLicenciaXid(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.licenciaService.listarLicenciaXid(this.id).subscribe((data) => {
        this.licencia = data;
        this.idgay = this.licencia.id;
      });
      resolve();
    });
  }

  identificarCliente(): Promise<void> {
    return new Promise((resolve, reject) => {
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
      this.id = this.activatedRoute.snapshot.params['id'];
      resolve();
    });
  }

  get permissions() {
    return this._permissions;
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

  onUpdate(): void {
    this.licenciaService.actualizarLicencia(this.id, this.licencia).subscribe(
      (data) => {
        Swal.fire({
          position: 'top',
          icon: 'success',
          title: 'Licencia actualizada con éxito',
          showConfirmButton: false,
          timer: 1500,
        });
        this.router.navigate(['/licencias/ver']);
      },
      (err) =>
        Swal.fire({
          title: 'Upss, existe un error ',
          icon: 'error',
        })
    );
  }
}
