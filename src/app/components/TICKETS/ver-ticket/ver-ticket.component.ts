import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import * as AOS from 'aos';
import * as CryptoJS from 'crypto-js';
import { Ticket } from 'src/app/models/Ticket';
import { TicketService } from 'src/app/services/ticket.service';

@Component({
  selector: 'app-ver-ticket',
  templateUrl: './ver-ticket.component.html',
  styleUrls: ['./ver-ticket.component.css'],
})
export class VerTicketComponent {
  ticket: Ticket = new Ticket();

  private _clienteSeleccionado: string = '';

  private readonly _permissions = {
    permi18tickets: '',
  };

  constructor(
    private ticketService: TicketService,
    private activatedRoute: ActivatedRoute,
    private titulo: Title
  ) {
    titulo.setTitle('Detalles Ticket');
    const permi18tickets = localStorage.getItem('IWqIWUsWUsIqIWUszWUx'); // Permiso encriptado
    const sharedSecret = 'BS5exry0olWCBKABS5exry0olWCBKABS5exry0olWCBKA'; // Generamos la llave para desencriptar
    const permi18ticketsX = CryptoJS.AES.decrypt(
      permi18tickets,
      sharedSecret
    ).toString(CryptoJS.enc.Utf8); // Permiso desencriptado
    if (permi18tickets) {
      this._permissions.permi18tickets = permi18ticketsX; // Se trae su respectivo código guardado en el localstorage y este luego se valida a que tiene acceso este código
    }
  }

  ngOnInit() {
    const clienteSeleccionado = localStorage.getItem(
      '6t9t8gBH896T987t8H0YT796h896979G6RT79g6'
    );
    const sharedSecretCliente =
      'xXry0olWBKA0olBSBKS5eWKASBKABS5eolXWCBA0oWCBKA'; // CLAVE PARA DESENCRIPTAR CLIENTE
    this._clienteSeleccionado = CryptoJS.AES.decrypt(
      clienteSeleccionado,
      sharedSecretCliente
    ).toString(
      // Desencriptamos
      CryptoJS.enc.Utf8
    );
    const id = this.activatedRoute.snapshot.params['id'];
    this.ticketService.listarTicketXid(id).subscribe((data) => {
      this.ticket = data;
    });
    AOS.init();
  }

  get permissions() {
    return this._permissions;
  }

  public get clienteSeleccionado(): string {
    return this._clienteSeleccionado;
  }
}
