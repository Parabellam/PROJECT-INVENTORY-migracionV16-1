import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as Aos from 'aos';
import { Muebles } from 'src/app/models/muebles';
import { MueblesService } from 'src/app/services/muebles.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-ver-detalles-muebles',
  templateUrl: './ver-detalles-muebles.component.html',
  styleUrls: ['./ver-detalles-muebles.component.css'],
})
export class VerDetallesMueblesComponent implements OnInit {
  muebles: Muebles = new Muebles();
  mueble: Muebles[] = [];
  estado: string[] = ['Disponible', 'Asignado', 'De Baja'];
  mostrar: string[] = ['No', 'Sí'];
  hiddenFile = true;

  private readonly _permissions = {
    permi3mue: '',
  };

  constructor(
    private mueblesService: MueblesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private titulo: Title
  ) {
    titulo.setTitle('Detalles Muebles y Enseres');
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
  }
  get permissions() {
    return this._permissions;
  }
}
