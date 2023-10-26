import { Cliente } from './../models/Cliente';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IngresarService } from './ingresar.service';
import { UrlService } from './url.service';
import jwtDecode, { JwtPayload } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class ClienteLoginService {
  public token: string;
  public token2: string;

  private email: string;
  private password: string;
  private cliente: any = Cliente;

  constructor(
    private httpClient: HttpClient,
    private userService: IngresarService,
    private urlService: UrlService
  ) {
    this.token = userService.getToken();
    this.token2 = userService.getSessionToken();

    const decodedToken: JwtPayload = jwtDecode(this.token2);
    this.email = decodedToken['sub'];
  }

  private urlCliente = this.urlService.getUrlBaseApi() + 'auth/cliente';

  private getHeaders(): HttpHeaders {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token2}`,
    });
    return headers;
  }

  setCliente(cliente: string) {
    this.cliente = cliente;
  }

  getCliente(): string {
    return this.cliente;
  }

  setEmail(email: string) {
    this.email = email;
  }

  getEmail(): string {
    return this.email;
  }

  getPassword(): string {
    return this.password;
  }

  setPassword(password: string) {
    this.password = password;
  }

  getToken(): string {
    return localStorage.getItem('token');
  }

  //listar clientes
  public listarCliente(mostrar: string): Observable<Cliente[]> {
    const headers = this.getHeaders();
    return this.httpClient.get<Cliente[]>(this.urlCliente, { headers });
  }

  //listar clientes por id
  public listarClienteXid(id: number): Observable<Cliente> {
    const headers = this.getHeaders();
    return this.httpClient.get<Cliente>(this.urlCliente + `/${id}`, {
      headers,
    });
  }

  //crear nuevos clientes
  public crearCliente(cliente: Cliente): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.post<Cliente>(this.urlCliente, cliente, {
      headers,
    });
  }

  //actualizar nuevos clientes
  public actualizarCliente(id: number, cliente: Cliente): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.put<any>(this.urlCliente + `/${id}`, cliente, {
      headers,
    });
  }
}
