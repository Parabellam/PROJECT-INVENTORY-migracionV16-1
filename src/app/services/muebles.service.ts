import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Muebles } from '../models/muebles';
import { UrlService } from './url.service';
import { IngresarService } from './ingresar.service';

@Injectable({
  providedIn: 'root',
})
export class MueblesService {
  public token2: string;

  constructor(
    private http: HttpClient,
    private urlService: UrlService,
    private userService: IngresarService
  ) {
    this.token2 = userService.getSessionToken();
  }

  private inmueblesUrl = this.urlService.getUrlBaseApi() + 'auth/inmuebles';

  private getHeaders(): HttpHeaders {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token2}`,
    });
    return headers;
  }

  //listar todos los Inmuebles
  public listarMuebles(
    mostrar: string,
    clienteSeleccionado: string
  ): Observable<Muebles[]> {
    const headers = this.getHeaders();
    const params = new HttpParams()
      .set('mostrar', mostrar)
      .set('mostrar_cliente', clienteSeleccionado);
    return this.http.get<Muebles[]>(this.inmueblesUrl, {
      params: params,
      headers,
    });
  }

  //listar un Inmuebles segun el id
  public listarParametrosXid(id: number): Observable<Muebles> {
    const headers = this.getHeaders();
    return this.http.get<Muebles>(this.inmueblesUrl + `/${id}`, { headers });
  }

  // crear un nuevo Inmuebles
  public crearMuebles(muebles: Muebles): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<Muebles>(this.inmueblesUrl, muebles, { headers });
  }

  //actualizar Inmuebles
  public actualizarMuebles(id: number, muebles: Muebles): Observable<Muebles> {
    const headers = this.getHeaders();
    return this.http.put<Muebles>(this.inmueblesUrl + `/${id}`, muebles, {
      headers,
    });
  }
}
