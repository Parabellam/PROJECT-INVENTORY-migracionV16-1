import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Funcionario } from '../models/Funcionario';
import { UrlService } from './url.service';
import { IngresarService } from './ingresar.service';

@Injectable({
  providedIn: 'root',
})
export class FuncionarioService {
  public token2: string;

  constructor(
    private httpClient: HttpClient,
    private urlService: UrlService,
    private userService: IngresarService
  ) {
    this.token2 = userService.getSessionToken();
  }

  private urlFuncionario =
    this.urlService.getUrlBaseApi() + 'auth/funcionarios';

  private getHeaders(): HttpHeaders {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token2}`,
    });
    return headers;
  }

  //listar Funcionario
  public listarFuncionarios(
    mostrar: string,
    clienteSeleccionado: string
  ): Observable<Funcionario[]> {
    const headers = this.getHeaders();
    const params = new HttpParams()
      .set('mostrar', mostrar)
      .set('mostrar_cliente', clienteSeleccionado);

    return this.httpClient.get<Funcionario[]>(this.urlFuncionario, {
      params: params,
      headers,
    });
  }

  //listar Funcionario por id
  public listarFuncionariosXid(id: number): Observable<Funcionario> {
    const headers = this.getHeaders();
    return this.httpClient.get<Funcionario>(this.urlFuncionario + `/${id}`, {
      headers,
    });
  }

  //crear nuevos Funcionario
  public crearFuncionarios(funcionario: Funcionario): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.post<Funcionario>(this.urlFuncionario, funcionario, {
      headers,
    });
  }

  //actualizar nuevos Funcionario
  public actualizarFuncionarios(
    id: number,
    funcionario: Funcionario
  ): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.put<any>(
      this.urlFuncionario + `/${id}`,
      funcionario,
      { headers }
    );
  }

  public eliminarFuncionarios(
    id: number,
    funcionario: { mostrar: string }
  ): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.put<any>(
      this.urlFuncionario + `/${id}`,
      funcionario,
      { headers }
    );
  }
}
