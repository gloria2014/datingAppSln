import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map, Observable } from 'rxjs';
import { AccountService } from '../_services/account.service';

@Injectable({
  providedIn: 'root'
})
/* clase 70 se crea un guard para activar la ruta y haci evitar navegar por las pestañas 
sin autorización */
export class AuthGuard implements CanActivate {

  constructor(private accountService:AccountService, private toastr:ToastrService) {}
  //  canActivate(
  //   route: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot)
  // : Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   return true;
  // }
 
  canActivate()
  : Observable<boolean>  {
   return this.accountService.currentUser$.pipe(
      map(user =>{
        if (user) return true;

        this.toastr.error("You shall not pass!!");
      })
    )
  }
}
