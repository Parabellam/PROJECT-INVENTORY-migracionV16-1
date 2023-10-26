import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TicketService } from 'src/app/services/ticket.service';
import { Sla } from 'src/app/models/Sla';
import Swal from 'sweetalert2';
import * as AOS from 'aos';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-tickets-parametros',
  templateUrl: './tickets-parametros.component.html',
  styleUrls: ['./tickets-parametros.component.css'],
})
export class TicketsParametrosComponent {
  /*instanciar la clase parametro como un array para acceder a todos sus datos
  desde un html con el ngFor
  */
  filterPost = '';
  sla: Sla[] = [];
  public page!: number;

  private readonly _permissions = {
    permi18tickets: '',
  };

  //constructor de la clase y sus atributos a utilizar
  constructor(
    private ticketService: TicketService,
    private titulo: Title
  ) {
    titulo.setTitle('Tickets Parámetros');
    const permi18tickets = localStorage.getItem('IWqIWUsWUsIqIWUszWUx'); // Permiso encriptado
    const sharedSecret = 'BS5exry0olWCBKABS5exry0olWCBKABS5exry0olWCBKA';
    const permi18ticketsX = CryptoJS.AES.decrypt(
      permi18tickets,
      sharedSecret
    ).toString(CryptoJS.enc.Utf8); // Permiso desencriptado
    if (permi18tickets) {
      this._permissions.permi18tickets = permi18ticketsX; // Se trae su respectivo código guardado en el localstorage y este luego se valida a que tiene acceso este código
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
    this.ticketService.listarSla().subscribe(
      (data) => {
        this.sla = data;
      },
      (err) => {}
    );
  }
}
