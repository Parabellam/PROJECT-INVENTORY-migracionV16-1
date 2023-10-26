import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import * as AOS from 'aos';
import { Licencia } from 'src/app/models/Licencia';
import { LicenciaService } from 'src/app/services/licencia.service';
import * as CryptoJS from 'crypto-js';
import { Equipo } from 'src/app/models/Equipo';

@Component({
  selector: 'app-ver-licencia',
  templateUrl: './ver-licencia.component.html',
  styleUrls: ['./ver-licencia.component.css'],
})
export class VerLicenciaComponent {
  licencia: Licencia = new Licencia();
  licencias: Licencia[] = [];
  mostrar: string[] = ['No', 'Si'];
  other: any;
  tipo: any;

  clienteSeleccionado: string;
  licenciasEquipos: any[] = [];
  equipos: Equipo[] = [];
  idgay: number;

  private readonly _permissions = {
    permi6lic: '',
  };

  constructor(
    private licenciaService: LicenciaService,
    private activatedRoute: ActivatedRoute,
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

    Promise.all([this.listarLicencia()]).then(() => {
      Promise.all([this.obtenerEquiposDeLicencia()]).then(() => {
        AOS.init();
      });
    });
  }

  listarLicencia(): Promise<void> {
    return new Promise((resolve, reject) => {
      const id = this.activatedRoute.snapshot.params['id'];
      this.licenciaService.listarLicenciaXid(id).subscribe((data) => {
        this.licencia = data;
        this.idgay = this.licencia.id;
        if (this.licencia && this.idgay) {
          resolve();
        } else {
          console.log('Error al listar licencia x id');
        }
      });
    });
  }

  obtenerEquiposDeLicencia(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.licenciaService.listarLicenciaEquipo().subscribe((data: any) => {
        this.licenciasEquipos = data.filter((f: any) => {
          return (
            f.mostrar === 'No' &&
            f.mostrar_cliente === this.clienteSeleccionado &&
            f.id === this.idgay
          );
        });
        if (this.licenciasEquipos) {
          resolve();
        } else {
          console.log('Error al filtrar los equipos x licencia');
        }
      });
    });
  }

  get permissions() {
    return this._permissions;
  }
}
