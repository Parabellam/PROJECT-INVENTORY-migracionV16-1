import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import * as AOS from 'aos';
import Swal from 'sweetalert2';
import { Cliente } from 'src/app/models/Cliente';
import { ClienteLoginService } from 'src/app/services/cliente-login.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-form-habilitar-clientes',
  templateUrl: './form-habilitar-clientes.component.html',
  styleUrls: ['./form-habilitar-clientes.component.css'],
})
export class FormHabilitarClientesComponent {
  cliente: Cliente = new Cliente();
  clientes: Cliente[] = [];
  estado: string[] = ['Disponible', 'Asignado', 'De Baja'];
  mostrar: string[] = ['No', 'Si'];
  other: any;
  tipo: any;

  // Captar y cambiar estado actual cuando es de baja
  mostraractual: any;
  mostrar2: any;

  private readonly _permissions = {
    permi13hcl: '',
  };

  constructor(
    private ClienteLoginService: ClienteLoginService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private titulo: Title
  ) {
    titulo.setTitle('Editar Cliente');
    const permi13hcl = localStorage.getItem('rVogPpaDKGrVogPpaDKG');
    const sharedSecret = 'BS5exry0olWCBKABS5exry0olWCBKABS5exry0olWCBKA'; // Generamos la llave para desencriptar
    const permi13hclX = CryptoJS.AES.decrypt(permi13hcl, sharedSecret).toString(
      // Desencriptamos
      CryptoJS.enc.Utf8
    );
    if (permi13hcl) {
      this._permissions.permi13hcl = permi13hclX;
    }
  }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.params['id'];
    this.ClienteLoginService.listarClienteXid(id).subscribe((data) => {
      this.cliente = data;
    });
    AOS.init();
  }

  get permissions() {
    return this._permissions;
  }

  onUpdate(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    this.ClienteLoginService.actualizarCliente(id, this.cliente).subscribe(
      (data) => {
        Swal.fire({
          position: 'top',
          icon: 'success',
          title: 'Cliente Actualizado con Éxito',
          showConfirmButton: false,
          timer: 1500,
        });
        this.router.navigate(['/clientes/ver']);
      },
      (err) =>
        Swal.fire({
          title: 'Upss, existe un error ',
          icon: 'error',
        })
    );
  }
}
