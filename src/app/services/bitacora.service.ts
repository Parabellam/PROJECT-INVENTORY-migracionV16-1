import { Bitacora } from '../models/Bitacora';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IngresarService } from './ingresar.service';
import { CookieService } from 'ngx-cookie-service';
import { UrlService } from './url.service';

@Injectable({
  providedIn: 'root',
})
export class BitacoraService {
  public token: string;
  public token2: string;

  constructor(
    private http: HttpClient,
    private userService: IngresarService,
    private cookies: CookieService,
    private urlService: UrlService
  ) {
    this.token = this.getToken();
    this.token2 = userService.getSessionToken();
  }

  private url = this.urlService.getUrlBaseApi() + 'auth/historial';

  private getHeaders(): HttpHeaders {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token2}`,
    });
    return headers;
  }

  public listarParametrosXid(id: number): Observable<Bitacora> {
    const headers = this.getHeaders();
    return this.http.get<Bitacora>(this.url + `/${id}`, { headers });
  }

  //listar todos los historiales
  public listarBitacora(
    mostrar: string,
    clienteSeleccionado: string
  ): Observable<Bitacora[]> {
    const headers = this.getHeaders();
    const params = new HttpParams()
      .set('mostrar', mostrar)
      .set('mostrar_cliente', clienteSeleccionado);

    return this.http.get<Bitacora[]>(this.url, { params: params, headers });
  }

  public crearBitacora(
    bitacora: Bitacora,
    actividad: string,
    codigo: string,
    fecha: Date,
    mostrar_cliente: String
  ): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(
      this.url +
        `/${actividad}` +
        `/${codigo}` +
        `/${fecha}` +
        `/${mostrar_cliente}`,
      bitacora,
      { headers }
    );
  }

  //create binnacle for complete body
  public createBinnacle(bitacora: Bitacora): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<Bitacora>(this.url, bitacora, { headers });
  }

  //actualizar bitacora
  public actualizarBitacora(
    id: number,
    bitacoras: Bitacora
  ): Observable<Bitacora> {
    const headers = this.getHeaders();
    return this.http.put<Bitacora>(this.url + `/${id}`, bitacoras, {
      headers,
    });
  }

  setToken(token: string) {
    return this.cookies.set('token', token);
  }

  //obtener token
  getToken() {
    return this.cookies.get('token');
  }

  // Filtro para exportar bitácora por rango de fehca
  public FiltrarBitacoraXFecha(
    desde: string,
    hasta: string
  ): Observable<Bitacora[]> {
    const headers = this.getHeaders();
    const params = {
      desde: desde,
      hasta: hasta,
    };
    return this.http.get<Bitacora[]>(this.url, { params: params, headers });
  }
}
