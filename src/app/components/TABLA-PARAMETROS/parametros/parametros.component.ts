import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ParametrosService } from 'src/app/services/parametros.service';
import { Parametros } from 'src/app/models/Parametros';
import Swal from 'sweetalert2';
import * as AOS from 'aos';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-parametros',
  templateUrl: './parametros.component.html',
  styleUrls: ['./parametros.component.css'],
})
export class ParametrosComponent implements OnInit {
  /*instanciar la clase parametro como un array para acceder a todos sus datos
  desde un html con el ngFor
  */
  filterPost = '';
  parametros: Parametros[] = [];
  public page!: number;

  private readonly _permissions = {
    permi10gpa: '',
  };

  //constructor de la clase y sus atributos a utilizar
  constructor(
    private parametrosService: ParametrosService,
    private titulo: Title
  ) {
    titulo.setTitle('Parámetros');
    const permi10gpa = localStorage.getItem('JVPMKbzc0DJVPMKbzc0D');
    const sharedSecret = 'BS5exry0olWCBKABS5exry0olWCBKABS5exry0olWCBKA'; // Generamos la llave para desencriptar
    const permi10gpaX = CryptoJS.AES.decrypt(permi10gpa, sharedSecret).toString(
      // Desencriptamos
      CryptoJS.enc.Utf8
    );
    if (permi10gpa) {
      this._permissions.permi10gpa = permi10gpaX;
    }
  }

  /*inicializador de la pagina, significa que, cada que cargue la pagina
  se va a cargar el metodo listarParametros()
  */
  ngOnInit() {
    AOS.init();
    this.listarParametros();
  }

  get permissions() {
    return this._permissions;
  }

  /*metodo que lista todos los parametros de la base de datos conectados
  por medio de los servicios
  */
  listarParametros(): void {
    this.parametrosService.listarParametros().subscribe(
      (data) => {
        this.parametros = data;
        this.parametros.reverse();
      },
      (err) => {}
    );
  }

  borrarParametros(parametro: Parametros) {
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
        this.parametrosService
          .eliminarParametro(parametro.id)
          .subscribe((data) => {
            this.parametrosService.listarParametros().subscribe((res) => {
              this.parametros = res;
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
}
