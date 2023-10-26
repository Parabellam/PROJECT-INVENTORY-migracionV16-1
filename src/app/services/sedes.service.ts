import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IngresarService } from './ingresar.service';
import { Sede } from '../models/Sede';
import { UrlService } from './url.service';

@Injectable({
  providedIn: 'root',
})
export class SedesService {
  public token: string;
  public token2: string;

  constructor(
    private httpClient: HttpClient,
    private userService: IngresarService,
    private urlService: UrlService
  ) {
    this.token = userService.getToken();
    this.token2 = userService.getSessionToken();
  }

  private urlSede = this.urlService.getUrlBaseApi() + 'auth/sede';

  private getHeaders(): HttpHeaders {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token2}`,
    });
    return headers;
  }

  //listar sedes
  public listarSede(mostrar: string): Observable<Sede[]> {
    const headers = this.getHeaders();
    const params = new HttpParams().set('mostrar', mostrar);
    return this.httpClient.get<Sede[]>(this.urlSede, {
      params: params,
      headers,
    });
  }

  //listar sedes por id
  public listarSedeXid(id: number): Observable<Sede> {
    const headers = this.getHeaders();
    return this.httpClient.get<Sede>(this.urlSede + `/${id}`, { headers });
  }

  //crear nuevos sedes
  public crearSede(sede: Sede): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.post<Sede>(this.urlSede, sede, {
      headers,
    });
  }

  //actualizar nuevos sedes
  public actualizarSede(id: number, sede: Sede): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.put<any>(this.urlSede + `/${id}`, sede, {
      headers,
    });
  }
}
