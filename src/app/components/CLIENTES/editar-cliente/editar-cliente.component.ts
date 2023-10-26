import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import * as AOS from 'aos';
import Swal from 'sweetalert2';
import { Cliente } from 'src/app/models/Cliente';
import { ClienteLoginService } from 'src/app/services/cliente-login.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-editar-cliente',
  templateUrl: './editar-cliente.component.html',
  styleUrls: ['./editar-cliente.component.css'],
})
export class EditarClienteComponent {
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
    permi9gcl: '',
  };

  constructor(
    private ClienteLoginService: ClienteLoginService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private titulo: Title
  ) {
    titulo.setTitle('Editar Cliente');
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
