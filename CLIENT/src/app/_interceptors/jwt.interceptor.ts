import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, take } from 'rxjs';
import { AccountService } from '../_services/account.service';
import { User } from '../_models/user';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private accountService:AccountService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let usuarioActual:User;

    /* clase 109 aca adjunta el token para cada solicitud cuando inicie sesión
    Si está conectado o viene el token de la api, entonces el header recibirá el token 
    de autorización y lo enviará con la solicitud:   return next.handle(request);  */
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => usuarioActual = user);
    if(usuarioActual){
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${usuarioActual.token}`
        }
      })
    }

    return next.handle(request);
  }
}
