import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { TestErrorsComponent } from './errors/test-errors/test-errors.component';
import { HomeComponent } from './home/home.component';
import { ListsComponent } from './lists/lists.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';

import { MemberListComponent } from './members/member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';
import { AuthGuard } from './_guards/auth.guard';


const routes: Routes = [
  /* para el inicio el path es vacio y se irá al componente Home*/
  {path:'', component:HomeComponent},

  /* lesson 71 aca se agrega una ruta ficticia que contendrá las rutas hijos
  esto con el fin de protegerlos con un solo guardia */
  {path:'',
  runGuardsAndResolvers:'always',
  canActivate:[AuthGuard],
  children:[
    {path:'members', component:MemberListComponent, canActivate:[AuthGuard]},
    {path:'members/:username', component: MemberDetailComponent},
    {path:'lists', component:ListsComponent},
    {path:'messages', component:MessagesComponent},
  ]
  },
  /* lesson 79 aca se agrega la ruta para llegar a los errores */
  {path:'errors', component:TestErrorsComponent},
  {path:'not-found', component:NotFoundComponent},
  {path:'server-error', component:ServerErrorComponent},
  
  /* cuado el usuario escribe cualquier cosa menos una de las rutas que estan definidas aqui, 
  el sistema lo redirecciona al home */

  // {path:'**', component:HomeComponent, pathMatch:'full'}
   {path:'**', component:NotFoundComponent, pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
