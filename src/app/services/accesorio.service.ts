import { IngresarService } from './ingresar.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Accesorio } from '../models/Accesorio';
import { UrlService } from './url.service';

@Injectable({
  providedIn: 'root',
})
export class AccesorioService {
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
  private urlAccesorio = this.urlService.getUrlBaseApi() + 'auth/accesorio';

  private getHeaders(): HttpHeaders {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token2}`,
    });
    return headers;
  }

  //listar accesorios
  public listarAccesorio(
    mostrar: string,
    clienteSeleccionado: string
  ): Observable<Accesorio[]> {
    const headers = this.getHeaders();
    const params = new HttpParams()
      .set('mostrar', mostrar)
      .set('mostrar_cliente', clienteSeleccionado);

    return this.httpClient.get<Accesorio[]>(this.urlAccesorio, {
      params: params,
      headers,
    });
  }

  //listar accesorios por id
  public listarAccesorioXid(id: number): Observable<Accesorio> {
    const headers = this.getHeaders();
    return this.httpClient.get<Accesorio>(this.urlAccesorio + `/${id}`, {
      headers,
    });
  }

  //crear nuevos accesorios
  public crearAccesorio(accesorio: Accesorio): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.post<Accesorio>(this.urlAccesorio, accesorio, {
      headers,
    });
  }

  //actualizar nuevos accesorios
  public actualizarAccesorio(
    id: number,
    accesorio: Accesorio
  ): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.put<any>(this.urlAccesorio + `/${id}`, accesorio, {
      headers,
    });
  }

  public updateState(
    id: number,
    accesorio: Accesorio,
    estado: string[]
  ): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.put<any>(
      this.urlAccesorio + `/${id}/${estado}`,
      accesorio,
      { headers }
    );
  }
}
