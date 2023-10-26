import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Parametros } from '../models/Parametros';
import { UrlService } from './url.service';
import { IngresarService } from './ingresar.service';

@Injectable({
  providedIn: 'root',
})
export class ParametrosService {
  public token2: string;

  constructor(
    private httpClient: HttpClient,
    private urlService: UrlService,
    private userService: IngresarService
  ) {
    this.token2 = userService.getSessionToken();
  }

  private urlParametro = this.urlService.getUrlBaseApi() + 'auth/parametros';

  private getHeaders(): HttpHeaders {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token2}`,
    });
    return headers;
  }

  //listar Parametros
  public listarParametros(): Observable<any[]> {
    const headers = this.getHeaders();
    return this.httpClient.get<Parametros[]>(this.urlParametro, { headers });
  }

  //listar parametros por id
  public listarParametrosXid(id: number): Observable<Parametros> {
    const headers = this.getHeaders();
    return this.httpClient.get<Parametros>(this.urlParametro + `/${id}`, {
      headers,
    });
  }

  //crear nuevos parametros
  public crearParametros(parametros: Parametros): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.post<Parametros>(this.urlParametro, parametros, {
      headers,
    });
  }

  //actualizar nuevos parametros
  public actualizarParametros(
    id: number,
    parametros: Parametros
  ): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.put<any>(this.urlParametro + `/${id}`, parametros, {
      headers,
    });
  }

  /* update the value what happened to the path for updated only the value */
  public updateValue(
    valor: string,
    id: number,
    parametro: Parametros
  ): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.put<any>(
      this.urlParametro + `/${id}` + `/${valor}`,
      parametro,
      { headers }
    );
  }

  //eliminar parametros
  public eliminarParametro(id: number) {
    const headers = this.getHeaders();
    return this.httpClient.delete(this.urlParametro + `/${id}`, { headers });
  }
}
