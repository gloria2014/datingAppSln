import { Component, OnInit } from '@angular/core';
import { Observable, take } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { Pagination } from 'src/app/_models/pagination';
import { User } from 'src/app/_models/user';
import { UserParams } from 'src/app/_models/userParams';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  //miembros :Member[];
  /* clase 123 se cambia el tipo de propiedad, ahora será de tipo observable */
 // miembros$ : Observable<Member[]>;
  /*  clase 157 se agrega nuevas propiedades */
  members:Member[];
  paginacion:Pagination;
  //pageNumber = 1;
  //pageSize = 2; // indica la cantidad de fotos que se muestran en la pantalla por página
  userParams: UserParams; // clase 161 se agrega esto
  usuario :User; // clase 161 se agrega esto
  genderList = [{value:'male',display:'males'},{value:'female',display:'females'}]; /* clase 162 se agrega combo */

  // constructor(private memberService:MembersService, private accountService:AccountService) { 
  //   this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
  //     this.usuario = user;
  //     this.userParams = new UserParams(user);
  //   })
  // }
  /* clase 170 se elimina el contenido del constructor y se llava al members.service.ts */
  constructor(private memberService:MembersService) { 
    this.userParams = this.memberService.getUserParams();
  }

  ngOnInit(): void {
    //this.loadMembers();
    /* clase 123 se deja de usar el método this.loadMembers(); y se hace la llamada directo al servicio */
      //this.miembros$ = this.memberService.getMembers();
      /* clase 157 se comenta la parte de arriba y se cmabia */
      this.loadMembers();
  }

  //  loadMembers(){ /* clase 157 se comenta este metodo */
  //   this.memberService.getMembers().subscribe( members =>{
  //     this.miembros = members;
  //     console.log('member-list/loadMembers ::: ' + JSON.stringify(members));
  //     console.log("member-list/loadMembers sin JSON :: " + this.miembros);
  //   })
  //  }
  /* clase 157 se comenta la parte de arriba poruqe se modfica */
  loadMembers(){
    this.memberService.getMembers(this.userParams)
    .subscribe(response =>{
      this.members = response.result;
      this.paginacion = response.pagination;
    })
  }

  /* clase 161 se cambia las propiedades pageNumber = 1;y pageSize = 2; por el objeto UserParams 
  y en el constructor se agrega la inyeccion de accountService */
  pageChanged(event:any){
      this.userParams.pageNumber = event.page;
      this.memberService.setUserParams(this.userParams); // clase 170 se agrega esta linea
      this.loadMembers();
  }

  resetFilters(){
    this.userParams = this.memberService.resetUserParams(); // clase 170 se comenta esto ->  new UserParams(this.usuario);
    this.loadMembers();
  }
}
