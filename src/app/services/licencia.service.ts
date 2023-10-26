import { Licencia } from '../models/Licencia';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IngresarService } from './ingresar.service';
import { UrlService } from './url.service';

@Injectable({
  providedIn: 'root',
})
export class LicenciaService {
  public token: string;
  private licencia: any = Licencia;
  public token2: string;

  constructor(
    private httpClient: HttpClient,
    private userService: IngresarService,
    private urlService: UrlService
  ) {
    this.token = userService.getToken();
    this.token2 = userService.getSessionToken();
  }

  private urlLicencia = this.urlService.getUrlBaseApi() + 'auth/licencia';

  private getHeaders(): HttpHeaders {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token2}`,
    });
    return headers;
  }

  setLicencia(licencia: string) {
    this.licencia = licencia;
  }

  getLicencia(): string {
    return this.licencia;
  }

  //listar Licencias
  public listarLicencia(
    mostrar: string,
    clienteSeleccionado: string
  ): Observable<Licencia[]> {
    const headers = this.getHeaders();
    const params = new HttpParams()
      .set('mostrar', mostrar)
      .set('mostrarCliente', clienteSeleccionado);

    return this.httpClient.get<Licencia[]>(this.urlLicencia, {
      params: params,
      headers,
    });
  }

  public listarLicencia2(
    mostrar: string,
    clienteSeleccionado: string
  ): Observable<Licencia[]> {
    const headers = this.getHeaders();
    const params = new HttpParams()
      .set('mostrar', mostrar)
      .set('mostrar_cliente', clienteSeleccionado);
    return this.httpClient.get<Licencia[]>(this.urlLicencia, {
      params: params,
      headers,
    });
  }

  //listar Licencias por id
  public listarLicenciaXid(id: number): Observable<Licencia> {
    const headers = this.getHeaders();
    return this.httpClient.get<Licencia>(this.urlLicencia + `/${id}`, {
      headers,
    });
  }

  //crear nuevos Licencias
  public crearLicencia(licencia: Licencia): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.post<Licencia>(this.urlLicencia, licencia, {
      headers,
    });
  }

  //actualizar nuevos Licencias
  public actualizarLicencia(id: number, licencia: Licencia): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.put<any>(this.urlLicencia + `/${id}`, licencia, {
      headers,
    });
  }

  //consultar equipoLicencia
  public listarLicenciaEquipo(): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.get<any>(`${this.urlLicencia}/listLicencia`, {
      headers,
    });
  }
}
