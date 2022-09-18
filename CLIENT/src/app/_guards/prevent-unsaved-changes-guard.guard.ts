import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { MemberEditComponent } from '../members/member-edit/member-edit.component';

@Injectable({
  providedIn: 'root'
})
/* clase 119 se crea el guard para asegurarse que el usuario va a dejar la ruta actual (pantalla actual)
este guard muestra un aviso javascript al usuario */
export class PreventUnsavedChangesGuardGuard implements CanDeactivate<unknown> {
  canDeactivate(
    component: MemberEditComponent): boolean {
      /* valida si el formulario tiene modificaciones, si usuario responde si entonces el componente se desactiva */
      if(component.editForm.dirty){
          return confirm("Are you sure you want to continue? Any unsaved changes will be lost ");
      }
    return true;
  }
  
}
