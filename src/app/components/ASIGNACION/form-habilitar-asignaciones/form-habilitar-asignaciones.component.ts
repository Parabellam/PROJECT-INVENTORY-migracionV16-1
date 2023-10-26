import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as Aos from 'aos';
import { Asignacion } from 'src/app/models/Asignacion';
import { Equipo } from 'src/app/models/Equipo';
import { Funcionario } from 'src/app/models/Funcionario';
import { AsignacionService } from 'src/app/services/asignacion.service';
import { EquipoServiceService } from 'src/app/services/equipo-service.service';
import { FuncionarioService } from 'src/app/services/funcionario.service';
import Swal from 'sweetalert2';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-form-habilitar-asignaciones',
  templateUrl: './form-habilitar-asignaciones.component.html',
  styleUrls: ['./form-habilitar-asignaciones.component.css']
})
export class FormHabilitarAsignacionesComponent {
  /*** variables */
  asignacion: Asignacion = new Asignacion();
  assignement: Asignacion[] = [];
  funcionario: Funcionario[] = [];
  funcionariosFiltrados: any[];
  equipo: Equipo[] = [];
  equiposFiltrados: any[];
  sede: string[] = ['MEDELLÍN', 'BOGOTÁ', 'CALI'];
  mostrar: string[] = ['No', 'Si'];
  siguienteCheckboxSeleccionado=false;

  permi1asi:string;

  clienteSeleccionado:string;

  /** contructor */

  constructor(
    private asignacionService: AsignacionService,
    private funcionarioService: FuncionarioService,
    private equipoService: EquipoServiceService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private titulo: Title
  ) {
    titulo.setTitle('Editar Asignación');
    const permi1asi = localStorage.getItem('D49k1gedp6D49k1gedp6');
    const sharedSecret = 'BS5exry0olWCBKABS5exry0olWCBKABS5exry0olWCBKA'; // Generamos la llave para desencriptar
    const permi1asiX = CryptoJS.AES.decrypt(permi1asi, sharedSecret).toString( // Desencriptamos
      CryptoJS.enc.Utf8
    );
    if (permi1asi) {
      this.permi1asi = permi1asiX;
    }
  }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params['id'];

    const clienteSeleccionado = localStorage.getItem('6t9t8gBH896T987t8H0YT796h896979G6RT79g6');
    const sharedSecretCliente =
      'xXry0olWBKA0olBSBKS5eWKASBKABS5eolXWCBA0oWCBKA'; // CLAVE PARA DESENCRIPTAR CLIENTE
    this.clienteSeleccionado = CryptoJS.AES.decrypt(
      clienteSeleccionado,
      sharedSecretCliente
    ).toString(
      // Desencriptamos
      CryptoJS.enc.Utf8
    );

    this.asignacionService.listarAsignacionXid(id).subscribe((data) => {
      this.asignacion = data;
    });

    /** load the page with the information compleye  */
    Aos.init();
    this.listarFuncionarios();
    this.listarEquipo();

  }



  /** create one new asignement */
  onUpdateAsignacion(): void {
    /** get data by id*/
    const id = this.activatedRoute.snapshot.params['id'];
    if (this.siguienteCheckboxSeleccionado) {
      this.asignacion.mostrar = 'No';
    }

    /** suscribe and save all data  entered  by user*/
    this.asignacionService.actualizarAsignacion(id, this.asignacion).subscribe(
      (data) => {
        Swal.fire({
          position: 'top',
          icon: 'success',
          title: 'Asignación Actualizada con Éxito',
          showConfirmButton: true,
          timer: 1500,
        }).then(() => {
          // aquí puedes hacer algo después de que se muestre el mensaje de éxito
          this.router.navigate(['/asignaciones/habilitar']);
        });
      },
      (err) => {
        console.log(err);
        Swal.fire({
          title: 'Upss, existe un error',
          icon: 'error',
        }).then(() => {
          // aquí puedes hacer algo después de que se muestre el mensaje de error
        });
      }
    );
  }

  /** list all officials */
  listarFuncionarios(): void {
    this.funcionarioService.listarFuncionarios('No', this.clienteSeleccionado).subscribe(
      (data) => {
        this.funcionario = data;
        this.funcionariosFiltrados = this.funcionario.filter(
          (f) => f.mostrar === 'Si'
        );
      },
      (err) => {
        console.log(err);
      }
    );
  }

  /*-----------------------listar equipos---------------------------*/
  listarEquipo(): void {
    this.equipoService.listarEquipo('No', this.clienteSeleccionado).subscribe((data) => {
      this.equipo = data;
    });
  }
}
