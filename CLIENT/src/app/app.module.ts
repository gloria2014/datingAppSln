import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { FormsModule } from '@angular/forms';

// agregar paquete de bootstrap y en el import tambien "TooltipModule.forRoot()"" 
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import{BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { MemberListComponent } from './members/member-list/member-list.component';

import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';

import { SharedModule } from './_modules/shared.module';
import { TestErrorsComponent } from './errors/test-errors/test-errors.component';
import { ErrorInterceptor } from './_interceptors/error.interceptor';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { MemberCardComponent } from './members/member-card/member-card.component';
import { JwtInterceptor } from './_interceptors/jwt.interceptor';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';


@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    RegisterComponent,
    MemberListComponent,

    MemberDetailComponent,

    ListsComponent,
    MessagesComponent,
    TestErrorsComponent,
    NotFoundComponent,
    ServerErrorComponent,
    MemberCardComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
   SharedModule
  ],
  providers: [
    // aca agrego el intercpeto que creamos y se le setea multi=true poruqe no queremos que 
    // remplaze alque viene por defecto sino mas bien que use nuestro interceptor
    {provide:HTTP_INTERCEPTORS, useClass:ErrorInterceptor, multi:true}
    /* clase 109 se agrega intercpetor jwt */
    ,{provide:HTTP_INTERCEPTORS, useClass:JwtInterceptor, multi:true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
