import { TicketService } from './../../../services/ticket.service';
import { Ticket } from './../../../models/Ticket';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import * as AOS from 'aos';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as CryptoJS from 'crypto-js';
import * as moment from 'moment';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css'],
})
export class TicketComponent {
  filterPost = '';
  tickets: Ticket[] = [];
  public page: number;
  length: any;
  private _clienteSeleccionado: string = '';

  // Formatos de fecha para mandar añ backend como parámetros y hacer la consulta por fechas
  currentDateString: string;
  dateAgoString: string;

  //item per page
  ipp: number;
  selectedIpp: number = 10;
  ippdd: string[] = ['10', '25', '50', '100'];

  private readonly _permissions = {
    permi18tickets: '',
  };

  //constructor de la clase y sus atributos a utilizar
  constructor(
    private ticketService: TicketService,
    private titulo: Title,
    private jwtHelper: JwtHelperService
  ) {
    titulo.setTitle('Tickets');

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
    const currentDate = moment();
    const oneMonthAgo = moment().subtract(1, 'months');

    this.currentDateString = currentDate.format('YYYY-MM-DD');

    this.dateAgoString = oneMonthAgo.format('YYYY-MM-DD');

    AOS.init();
    //this.listarTickets();
    this.getTickets();
  }

  get permissions() {
    return this._permissions;
  }

  public get clienteSeleccionado(): string {
    return this._clienteSeleccionado;
  }

  getTickets() {
    this.ticketService
      .listarTicket(this.currentDateString, this.dateAgoString)
      .subscribe((data: any) => {
        this.tickets = data.sort((a: any, b: any) => {
          return parseInt(b.fechaIngreso) - parseInt(a.fechaIngreso);
        }).reverse();
      });
  }

  // Event Click Tamaño Paginación
  ippclick(ipp: any) {
    this.selectedIpp = ipp;
    this.page = 1;
  }

  resetPage() {
    this.page = 1;
  }

  FiltrarBitacoraXFecha(currentDateString: string, dateAgoString: string) {
    this.ticketService
      .listarTicket(currentDateString, dateAgoString)
      .subscribe((data) => {
        this.tickets = data.reverse();
      });
  }

  /** filter data of files what need in the table */
  filtrarDatos(currentDateString: string, dateAgoString: string): any[] {
    const fechaIni = new Date(currentDateString);
    const fechaFin = new Date(dateAgoString);

    return this.tickets
      .filter((res) => {
        const date = new Date(res.fechaIngreso);
        const fechaFinModificada = new Date(fechaFin);
        fechaFinModificada.setDate(fechaFinModificada.getDate() + 1);
        return date >= fechaIni && date <= fechaFinModificada;
      })
      .map((tickets) => {
        return {
          idTicket: tickets.idTicket,
          numeroTicket: tickets.numeroTicket,
          usuario: tickets.usuario,
          correo: tickets.correo,
          problema: tickets.problema,
          departamento: tickets.departamento,
          fechaIngreso: tickets.fechaIngreso,
          prioridad: tickets.prioridad,
          duracion_minutos: tickets.duracionMinutos,
          enviadoVia: tickets.enviadoVia,
          asunto: tickets.asunto,
          asignadoA: tickets.asignadoA,
          ANS: tickets.respuesta,
          estadoFinal: tickets.estadoFinal,
          fechaCierre: tickets.fechaCierre,
          fechaActualizacion: tickets.fechaActualizacion,
        };
      });
  }

  exportExcel() {
    const fechaIni = (document.getElementById('inicia') as HTMLInputElement)
      .value;
    const fechaFin = (document.getElementById('fin') as HTMLInputElement).value;

    const filterData = this.filtrarDatos(fechaIni, fechaFin);
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(filterData); // Sale Data
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer, 'Tickets');
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    const url = window.URL.createObjectURL(data);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display:none');
    a.href = url;
    a.download = fileName + '.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}
