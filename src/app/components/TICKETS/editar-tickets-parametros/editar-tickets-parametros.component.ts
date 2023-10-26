import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import * as AOS from 'aos';
import * as CryptoJS from 'crypto-js';

import { Sla } from 'src/app/models/Sla';
import { TicketService } from 'src/app/services/ticket.service';

@Component({
  selector: 'app-editar-tickets-parametros',
  templateUrl: './editar-tickets-parametros.component.html',
  styleUrls: ['./editar-tickets-parametros.component.css'],
})
export class EditarTicketsParametrosComponent {
  sla: Sla = new Sla();
  tiempo: number;

  private readonly _permissions = {
    permi18tickets: '',
  };

  constructor(
    private ticketService: TicketService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private titulo: Title
  ) {
    titulo.setTitle('Editar Parámetro');
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

  ngOnInit() {
    const id = this.activatedRoute.snapshot.params['id'];
    this.ticketService.listarSlaXid(id).subscribe((data) => {
      this.sla = data;
    });
    AOS.init();
  }

  get permissions() {
    return this._permissions;
  }

  onUpdate(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    this.tiempo = this.sla.tiempo;
    this.ticketService.actualizarSla(id, this.tiempo).subscribe(
      () => {
        Swal.fire({
          position: 'top',
          icon: 'success',
          title: 'Parámetro actualizado con éxito',
          showConfirmButton: false,
          timer: 1500,
        });
        this.router.navigate(['/tickets/parametros']);
      },
      (err) => {
        Swal.fire({
          title: 'Upss, existe un error" ',
          icon: 'error',
        });
        console.log(err);
      }
    );
  }
}
