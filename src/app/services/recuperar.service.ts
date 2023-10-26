import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IngresarService } from './ingresar.service';
import { CookieService } from 'ngx-cookie-service';
import { UrlService } from './url.service';

@Injectable({
  providedIn: 'root',
})
export class RecuperarService {
  public token: string;

  //httpClient es un servicio que permite la comunicacion cliente-servidor
  constructor(
    private http: HttpClient,
    private userService: IngresarService,
    private cookies: CookieService,
    private urlService: UrlService
  ) {
    this.token = this.getToken();
  }

  private url = this.urlService.getUrlBaseApi() + 'recover';

  setToken(token: string) {
    return this.cookies.set('token', token);
  }

  //obtener token
  getToken() {
    return this.cookies.get('token');
  }

  //Olvidé la contraseña, se envia un correo al email ingresado
  forgotPassword(email: string) {
    return this.http.post(this.url + `/forgot-password`, { email: email });
  }

  resetPassword(token: string, newPassword: string) {
    return this.http.post(this.url + `/reset-password`, {
      token: token,
      newPassword: newPassword,
    });
  }

  validateResetToken(token: string) {
    return this.http.get(this.url + `/traer-token`, {
      params: { token: token },
    });
  }

  intentosSuperados(email: string) {
    return this.http.post(this.url + `/intentos-superados`, { email: email }); // Include options as the third parameter
  }
}
