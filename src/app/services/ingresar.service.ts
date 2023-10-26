import { _isTestEnvironment } from '@angular/cdk/platform';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { Usuario } from '../models/Usuario';
import { UrlService } from './url.service';

@Injectable({
  providedIn: 'root',
})
export class IngresarService {
  public token: string;
  public getUser: string;
  public username: string;
  private rol: string = 'h';

  public token2: string;

  isActive = '0';

  constructor(
    private httpClient: HttpClient,
    private cookies: CookieService,
    private jwtHelper: JwtHelperService,
    private router: Router,
    private urlService: UrlService
  ) {
    this.token = this.getToken();

    localStorage.setItem('token', JSON.stringify(this.token));

    this.rol = this.getRol();
    localStorage.setItem('rol', JSON.stringify(this.rol));
  }

  private url = this.urlService.getUrlBaseApi() + 'auth';
  private url2 = this.urlService.getUrlBaseApi();

  private getHeaders(): HttpHeaders {
    this.token2 = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token2}`,
    });
    return headers;
  }

  public eliminarRelacionUserCliente(
    urlUser: number,
    idCliente: number
  ): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.delete(
      `${this.url}/users/${urlUser}/clientes/${idCliente}`, {headers}
    );
  }

  setClientId(id: string) {
    localStorage.setItem('idCliente', id);
  }

  getClient() {
    return localStorage.getItem('idCliente');
  }

  public login(user: any): Observable<any> {
    return this.httpClient.post(this.url2 + 'authenticate', user);
  }

  register(user: Usuario): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.post<Usuario>(this.url + '/register', user, {headers});
  }

  public updated(id: number, usuario: Usuario): Observable<Usuario> {
    const headers = this.getHeaders();
    return this.httpClient.put<Usuario>(
      this.url + '/updated/' + `${id}`,
      usuario, {headers}
    );
  }

  public actualizarUsuario(id: number, usuario: Usuario): Observable<Usuario> {
    const headers = this.getHeaders();
    return this.httpClient.put<Usuario>(this.url + `/${id}`, usuario, {
      headers,
    });
  }

  public eliminarUsuario(id: number) {
    const headers = this.getHeaders();
    return this.httpClient.delete(this.url + '/delete' + `/${id}`, {headers});
  }

  user() {
    const headers = this.getHeaders();
    return this.httpClient.get(this.url, {
      headers,
    });
  }

  public listarUserById(id: number): Observable<Usuario> {
    const headers = this.getHeaders();
    return this.httpClient.get<Usuario>(this.url + `/${id}`, {headers});
  }

  setToken(token: string) {
    return this.cookies.set('token', token);
  }

  getToken() {
    return this.cookies.get('token');
  }

  setLocalStorageToken(token: string) {
    return localStorage.setItem('token', token);
  }

  getLocalStorageToken() {
    return localStorage.getItem('token');
  }

  setSessionToken(token: string) {
    return sessionStorage.setItem('token', token);
  }

  getSessionToken() {
    return sessionStorage.getItem('token');
  }

  //guardar el rol segun la autenticación
  setRol(rol: string) {
    this.rol = this.getRol();
    return this.cookies.set('rol', this.rol);
  }

  getRol() {
    return this.cookies.get('rol');
  }

  //de esta manera obtenemos por medio del token el usuario logueado
  getTokenSession() {
    this.getUser = localStorage.getItem('token');
    const tokenPayload = this.jwtHelper.decodeToken(this.getUser);
    this.username = tokenPayload.sub;
  }

  //obtener el rol del usuario logueado
  getUserRol() {
    this.getUser = localStorage.getItem('token');
    const tokenPayload = this.jwtHelper.decodeToken(this.getUser);
    this.username = tokenPayload.rol;
  }

  logout() {
    localStorage.removeItem('token');
    this.cookies.delete('token');
    this.router.navigate(['/login']);
  }

  //Obtener un usuario por email
  public getUsuarioPorEmail(email: string): Observable<Usuario> {
    const headers = this.getHeaders();
    return this.httpClient.get<Usuario>(this.url + `/email/${email}`, {
      headers,
    });
  }

  //listar usuarios por email
  public listarUserByCorreo(email: string): Observable<Usuario> {
    const headers = this.getHeaders();
    return this.httpClient.get<Usuario>(`${this.url}?email=${email}`, {
      headers,
    });
  }

  //listar Usuarios
  public listarUsuario(): Observable<any[]> {
    const headers = this.getHeaders();
    return this.httpClient.get<Usuario[]>(this.url, { headers });
  }

  storeEncryptedData(key: string, encryptedData: string): void {
    const expiresInDays = 1; // Establece la duración de la cookie en días

    this.cookies.set(
      key,
      encryptedData,
      expiresInDays,
      '/',
      undefined,
      true,
      'Strict'
    );
  }
}
