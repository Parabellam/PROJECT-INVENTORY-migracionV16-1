import { Asignacion } from './../models/Asignacion';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UrlService } from './url.service';
import { IngresarService } from './ingresar.service';

@Injectable({
  providedIn: 'root',
})
export class AsignacionService {
  public token: string;
  public token2: string;

  constructor(
    private httpClient: HttpClient,
    private urlService: UrlService,
    private userService: IngresarService
  ) {
    this.token2 = userService.getSessionToken();
  }

  private urlAsignacion = this.urlService.getUrlBaseApi() + 'auth/asignaciones';

  private getHeaders(): HttpHeaders {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token2}`,
    });
    return headers;
  }

  public eliminarRelacionesAsignacionAccesorios(
    idAsignacion: number,
    idsAccesorios: number[]
  ): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.delete(
      `${this.urlAsignacion}/${idAsignacion}/accesorios`,
      { body: idsAccesorios, headers }
    );
  }

  //listar Asignacion
  public listarAsignacion(
    mostrar: string,
    clienteSeleccionado: string
  ): Observable<Asignacion[]> {
    const headers = this.getHeaders();
    const params = new HttpParams()
      .set('mostrar', mostrar)
      .set('mostrar_cliente', clienteSeleccionado);

    return this.httpClient.get<Asignacion[]>(this.urlAsignacion, {
      params: params,
      headers,
    });
  }

  //listar Asignacion por id
  public listarAsignacionXid(id: number): Observable<Asignacion> {
    const headers = this.getHeaders();
    return this.httpClient.get<Asignacion>(this.urlAsignacion + `/${id}`, {
      headers,
    });
  }

  //crear nuevos Asignacion
  public crearAsignacion(asignacion: Asignacion): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.post<Asignacion>(this.urlAsignacion, asignacion, {
      headers,
    });
  }

  //actualizar nuevas asignaciones
  public actualizarAsignacion(
    id: number,
    asignacion: Asignacion
  ): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.put<any>(this.urlAsignacion + `/${id}`, asignacion, {
      headers,
    });
  }

  //eliminar asignacion
  public eliminarAsignacion(id: number) {
    const headers = this.getHeaders();
    return this.httpClient.delete(this.urlAsignacion + `/${id}`, { headers });
  }
}
