import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import * as AOS from 'aos';
import Swal from 'sweetalert2';
import { Cliente } from 'src/app/models/Cliente';
import { ClienteLoginService } from 'src/app/services/cliente-login.service';
import { Sede } from 'src/app/models/Sede';
import { SedesService } from 'src/app/services/sedes.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-form-habilitar-sede',
  templateUrl: './form-habilitar-sede.component.html',
  styleUrls: ['./form-habilitar-sede.component.css'],
})
export class FormHabilitarSedeComponent {
  sede: Sede = new Sede();
  sedes: Sede[] = [];
  cliente: Cliente = new Cliente();
  clientes: Cliente[] = [];

  estado: string[] = ['Disponible', 'Asignado', 'De Baja'];
  mostrar: string[] = ['No', 'Si'];
  other: any;
  tipo: any;

  clientesSeleccionados: string; // Drop Down para seleccionar el cliente que va asignado a esa sede

  // Captar y cambiar estado actual cuando es de baja
  mostraractual: any;
  mostrar2: any;

  private readonly _permissions = {
    permi9gcl: '',
  };

  constructor(
    private clienteService: ClienteLoginService,
    private sedeService: SedesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private titulo: Title
  ) {
    titulo.setTitle('Editar Sede Oculta');
    const permi9gcl = localStorage.getItem('g99XNqkYmJg99XNqkYmJ');
    const sharedSecret = 'BS5exry0olWCBKABS5exry0olWCBKABS5exry0olWCBKA'; // Generamos la llave para desencriptar
    const permi9gclX = CryptoJS.AES.decrypt(permi9gcl, sharedSecret).toString(
      // Desencriptamos
      CryptoJS.enc.Utf8
    );
    if (permi9gcl) {
      this._permissions.permi9gcl = permi9gclX;
    }
  }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.params['id'];
    this.sedeService.listarSedeXid(id).subscribe((data) => {
      this.sede = data;
    });
    AOS.init();
    this.listarCliente();
  }

  get permissions() {
    return this._permissions;
  }

  onUpdate(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    this.sedeService.actualizarSede(id, this.sede).subscribe(
      (data) => {
        Swal.fire({
          position: 'top',
          icon: 'success',
          title: 'Sede Actualizada con Éxito',
          showConfirmButton: false,
          timer: 1500,
        });
        this.router.navigate(['/sedes/habilitar']);
      },
      (err) =>
        Swal.fire({
          title: 'Upss, existe un error ',
          icon: 'error',
        })
    );
  }

  listarCliente(): void {
    this.clienteService.listarCliente('Si').subscribe((data) => {
      this.clientes = data;
    });
  }
}
