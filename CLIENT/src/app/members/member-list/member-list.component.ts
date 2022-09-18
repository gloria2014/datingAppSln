import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  //miembros :Member[];
  /* clase 123 se cambia el tipo de propiedad, ahora será de tipo observable */
  miembros$ : Observable<Member[]>;
  
  constructor(private memberService:MembersService) { }

  ngOnInit(): void {
    //this.loadMembers();
    /* clase 123 se deja de usar el método this.loadMembers(); y se hace la llamada directo al servicio */
      this.miembros$ = this.memberService.getMembers();
  }

  //  loadMembers(){
  //   this.memberService.getMembers().subscribe( members =>{
  //     this.miembros = members;
  //     console.log('member-list/loadMembers ::: ' + JSON.stringify(members));
  //     console.log("member-list/loadMembers sin JSON :: " + this.miembros);
  //   })
  //  }
}
