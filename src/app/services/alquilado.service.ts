import { IngresarService } from './ingresar.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Alquilado } from '../models/Alquilado';
import { UrlService } from './url.service';

@Injectable({
  providedIn: 'root',
})
export class AlquiladoService {
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

  private urlAlquilado = this.urlService.getUrlBaseApi() + 'auth/alquilados';

  private getHeaders(): HttpHeaders {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token2}`,
    });
    return headers;
  }

  public listarAlquilado(
    mostrar: string,
    clienteSeleccionado: string
  ): Observable<Alquilado[]> {
    const headers = this.getHeaders();
    const params = new HttpParams()
      .set('mostrar', mostrar)
      .set('mostrarCliente', clienteSeleccionado);
    return this.httpClient.get<Alquilado[]>(this.urlAlquilado, {
      params: params,
      headers,
    });
  }

  //listar alquilado por id
  public listarAlquiladoXid(id: number): Observable<Alquilado> {
    const headers = this.getHeaders();
    return this.httpClient.get<Alquilado>(this.urlAlquilado + `/${id}`, {
      headers,
    });
  }

  //crear nuevos alquilados
  public crearAlquilado(alquilado: Alquilado): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.post<Alquilado>(this.urlAlquilado, alquilado, {
      headers,
    });
  }

  //actualizar nuevos alquilados
  public actualizarAlquilado(
    id: number,
    alquilado: Alquilado
  ): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.put<any>(this.urlAlquilado + `/${id}`, alquilado, {
      headers,
    });
  }

  public updateState(
    id: number,
    alquilado: Alquilado,
    estado: string
  ): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.put<any>(
      this.urlAlquilado + `/${id}/${estado}`,
      alquilado,
      { headers }
    );
  }
}
