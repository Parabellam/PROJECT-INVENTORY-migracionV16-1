import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Equipo } from '../models/Equipo';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { UrlService } from './url.service';
import { IngresarService } from './ingresar.service';

@Injectable({
  providedIn: 'root',
})
export class EquipoServiceService {
  public token: string;
  public token2: string;

  constructor(
    private http: HttpClient,
    private cookies: CookieService,
    private urlService: UrlService,
    private userService: IngresarService
  ) {
    this.token = this.getToken();
    this.token2 = userService.getSessionToken();
  }

  private equipoUrl = this.urlService.getUrlBaseApi() + 'auth/equipos';

  private getHeaders(): HttpHeaders {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token2}`,
    });
    return headers;
  }

  public eliminarRelacion(
    idEquipo: number,
    idLicencia: number
  ): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(
      `${this.equipoUrl}/${idEquipo}/licencias/${idLicencia}`,
      { headers }
    );
  }

  //listar todos los equipo
  public listarEquipo(
    mostrar: string,
    clienteSeleccionado: string
  ): Observable<Equipo[]> {
    const headers = this.getHeaders();
    const params = new HttpParams()
      .set('mostrar', mostrar)
      .set('mostrar_cliente', clienteSeleccionado);
    return this.http.get<Equipo[]>(this.equipoUrl, {
      params: params,
      headers,
    });
  }

  //listar un equipo segun el id
  public listarParametrosXid(id_equipo: number): Observable<Equipo> {
    const headers = this.getHeaders();
    return this.http.get<Equipo>(this.equipoUrl + `/${id_equipo}`, { headers });
  }

  // crear un nuevo equipo
  public crearEquipo(equipo: Equipo): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<Equipo>(this.equipoUrl, equipo, { headers });
  }

  //actualizar equipo
  public actualizarEquipo(
    id_equipo: number,
    equipo: Equipo
  ): Observable<Equipo> {
    const headers = this.getHeaders();
    return this.http.put<Equipo>(this.equipoUrl + `/${id_equipo}`, equipo, {
      headers,
    });
  }

  public updateState(
    id: number,
    equipo: Equipo,
    estado: string
  ): Observable<any> {
    const headers = this.getHeaders();
    return this.http.put<any>(
      this.equipoUrl + `/${id}` + `/${estado}`,
      equipo,
      { headers }
    );
  }

  public eliminarEquipoLicencias(id: number) {
    const headers = this.getHeaders();
    return this.http.delete(this.equipoUrl + `/${id}` + '/licencias', {
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

  public GetDispositivos(cliente: string): Observable<any[]> {
    const headers = this.getHeaders();
    return this.http.get<any[]>(`${this.equipoUrl}/dispositivos/${cliente}`, {
      headers,
    });
  }
}
