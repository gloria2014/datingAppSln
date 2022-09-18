import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { delay, finalize, Observable } from 'rxjs';
import { BusyService } from '../_services/busy.service';

/* clase 122 se crea este interceptor para mostrar el loading  */
@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(private busyService: BusyService) {}
/* clase 122 cuando se va a enviar la solicitud el interceptor va a llamar a los métodos 
del busyService.ts */
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.busyService.busy();
    return next.handle(request).pipe(
      delay(1000),
      finalize(()=> {
        this.busyService.idle(); /* Ahora ir al app.module.ts y agregar este interceptor */
      })
    )
  }
}
