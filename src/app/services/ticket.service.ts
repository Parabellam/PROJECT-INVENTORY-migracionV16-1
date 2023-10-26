import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ticket } from '../models/Ticket';
import { Sla } from '../models/Sla';
import { UrlService } from './url.service';
import { IngresarService } from './ingresar.service';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  public token2: string;

  constructor(
    private httpClient: HttpClient,
    private urlService: UrlService,
    private userService: IngresarService
  ) {
    this.token2 = userService.getSessionToken();
  }

  private urlTicket = this.urlService.getUrlBaseApi() + 'auth/tickets';

  private getHeaders(): HttpHeaders {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token2}`,
    });
    return headers;
  }

  //listar tickets con parámetros
  public listarTicket(
    currentDateString: string,
    dateAgoString: string
  ): Observable<Ticket[]> {
    const headers = this.getHeaders();
    return this.httpClient.get<Ticket[]>(
      this.urlTicket + `/${dateAgoString}/${currentDateString}`,
      { headers }
    );
  }

  //listar ticket por id
  public listarTicketXid(idTicket: number): Observable<Ticket> {
    const headers = this.getHeaders();
    return this.httpClient.get<Ticket>(this.urlTicket + `/${idTicket}`, {
      headers,
    });
  }

  //listar tickets abiertos por orden (más viejos primero)
  public listarAbiertos(): Observable<Ticket[]> {
    const headers = this.getHeaders();
    return this.httpClient.get<Ticket[]>(this.urlTicket + `/abiertos`, {
      headers,
    });
  }

  //listar tickets cerrados por orden (más viejos primero)
  public listarCerrados(
    currentDateString: string,
    dateAgoString: string
  ): Observable<Ticket[]> {
    const headers = this.getHeaders();
    return this.httpClient.get<Ticket[]>(
      this.urlTicket + `/cerrado` + `/${dateAgoString}/${currentDateString}`,
      { headers }
    );
  }

  //listar tickets por mes en el year presente
  public readTicketByMonth(): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.get<any>(this.urlTicket + '/presente', { headers });
  }

  //listar tickets por mes en el year presente
  public listDepartament(): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.get<any>(this.urlTicket + '/departamento', {
      headers,
    });
  }

  //listar todos sla
  public listarSla(): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.get<any>(this.urlTicket + '/slaList', { headers });
  }

  //listar sla X id
  public listarSlaXid(id: number): Observable<Sla> {
    const headers = this.getHeaders();
    return this.httpClient.get<Sla>(this.urlTicket + '/slaList' + `/${id}`, {
      headers,
    });
  }

  // actualizar sla
  public actualizarSla(id: number, tiempo: number): Observable<any> {
    const headers = this.getHeaders();
    const body = { tiempo: tiempo };
    return this.httpClient.put<any>(
      this.urlTicket + '/sla' + `/${id}/${tiempo}`,
      body,
      { headers }
    );
  }

  //listar ticket por departamento (ABIERTO)
  public listarTicketXDepartamentoOpen(
    departamento: string
  ): Observable<Ticket> {
    const headers = this.getHeaders();
    return this.httpClient.get<Ticket>(
      this.urlTicket + '/departamentByOpen' + `/${departamento}`,
      { headers }
    );
  }

  //listar ticket por departamento (CERRADO)
  public listarTicketXDepartamentoClosed(
    currentDateString: string,
    dateAgoString: string,
    departamento: string
  ): Observable<Ticket> {
    const headers = this.getHeaders();
    return this.httpClient.get<Ticket>(
      this.urlTicket +
        '/departamentByClosed' +
        `/${dateAgoString}/${currentDateString}/${departamento}`,
      { headers }
    );
  }
}
