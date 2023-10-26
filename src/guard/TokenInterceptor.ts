import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IngresarService } from '../app/services/ingresar.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authService: IngresarService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: 'Bearer ' + token,
        },
      });
    }
    return next.handle(req).pipe(
      catchError((error) => {
        if (error.status === 401 || error.status === 403) {
          this.authService.logout();
        }
        return throwError(error);
      })
    );
  }
}
