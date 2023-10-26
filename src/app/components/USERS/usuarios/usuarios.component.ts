import { Usuario } from 'src/app/models/Usuario';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { IngresarService } from 'src/app/services/ingresar.service';
import Swal from 'sweetalert2';
import * as AOS from 'aos';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
})
export class UsuariosComponent implements OnInit {
  /**---------------------------variables a utilizar----------------------------------- */
  users: any;
  public page!: number;
  filterPost = '';

  private readonly _permissions = {
    permi11gus: '',
  };

  constructor(private service: IngresarService, private tittle: Title) {
    tittle.setTitle('Usuarios');
    this.users = [];
    const permi11gus = localStorage.getItem('XnYr4WVm4pXnYr4WVm4p');
    const sharedSecret = 'BS5exry0olWCBKABS5exry0olWCBKABS5exry0olWCBKA'; // Generamos la llave para desencriptar
    const permi11gusX = CryptoJS.AES.decrypt(permi11gus, sharedSecret).toString(
      // Desencriptamos
      CryptoJS.enc.Utf8
    );
    if (permi11gus) {
      this._permissions.permi11gus = permi11gusX;
    }
  }

  get permissions() {
    return this._permissions;
  }

  ngOnInit(): void {
    this.usuarios();
    AOS.init();
  }

  //listar todos los usuarios
  usuarios() {
    this.service.user().subscribe((user) => {
      this.users = user;
      this.users.reverse(); // Aplicar el método reverse() después de asignar el arreglo
    });
  }

  //Eliminar
  borrarUsuario(usuario: Usuario) {
    Swal.fire({
      title: '¿Estas seguro de eliminar?',
      text: '¡Al eliminar ya no podrás recuperarlo!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, ¡eliminar!',
    }).then((re) => {
      if (re.isConfirmed) {
        this.service.eliminarUsuario(usuario.id).subscribe((data) => {
          this.service.user().subscribe((res) => {
            this.users = res;
          });
        });
        Swal.fire({
          icon: 'success',
          title: 'Eliminado!',
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        Swal.close;
      }
    });
  }

  //item per page
  ipp: number;
  selectedIpp: number = 10;
  ippdd: string[] = ['10', '25', '50', '100'];

  // Event Click Tamaño Paginación
  ippclick(ipp: any) {
    this.selectedIpp = ipp;
    this.page = 1;
  }

  resetPage() {
    this.page = 1;
  }
}
