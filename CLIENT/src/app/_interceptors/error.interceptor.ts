import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router:Router, private toastr:ToastrService) {  
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError(error => {
        if(error){
          switch(error.status) // error.status es el key que validará
          {
            case 400: // cuando el error es 400
              if(error.error.errors){
                // cuando presiona register y no ha ingresado nada en los input 
                const modalStateErrors = [];
                for (const key in error.error.errors){
                  if(error.error.errors[key]){
                    modalStateErrors.push(error.error.errors[key]);
                  }
                }
                console.log("paso 3 :: " + error);
                // ahora llevamos el error al componente
                throw modalStateErrors.flat();

              }else{
                // cunado si ha encontrado datos en los imput, muestro mensaje toast por pantalla
               
               // this.toastr.error(error.statusText, error.status);
               this.toastr.error(error.statusText === "OK"? "bad request" : error.statusText.error.status);
                console.log("paso 4 :: " + error);
              }
              break;
              case 401:
           
                this.toastr.error(error.statusText === "OK" ? "Usuario no autorizado" : error.statusText, error.status);
                console.log("errorInterceptor 401 :: " + error);
                break;
                case 404: // cunado no encuentra la página y lo redirecciona x url
                this.router.navigateByUrl("/not-found");
                console.log("soy el error 404 ::"+ error);
                break;
                case 500:// redirecciona a la página del servidor
                const navigationExtras: NavigationExtras = {state:{error:error.error}}
                this.router.navigateByUrl("/server-error",navigationExtras);
                // lesion 83.- se crea un compoente server-error para manejar el error 500 aca se mostraá 
                // la pantalla con lo que debe de hacer el usuario
                break;
            default:
              this.toastr.error('something unexpected went wrong ');
              console.log("MIRA EL ERROR :: "+error);
              break;
          }
        }
        return throwError(error);
      })
    );
  }
}
