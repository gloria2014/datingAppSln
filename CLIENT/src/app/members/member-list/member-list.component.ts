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

  members:Member[];
  paginacion:Pagination;
  userParams: UserParams; 
  usuario :User; 
  genderList = [{value:'male',display:'males'},{value:'female',display:'females'}]; /* clase 162 se agrega combo */


  constructor(private memberService:MembersService) { 
    this.userParams = this.memberService.getUserParams();
  }

  ngOnInit(): void {

      this.loadMembers();
  }

  loadMembers(){
    this.memberService.getMembers(this.userParams)
    .subscribe(response =>{
      this.members = response.result;
      this.paginacion = response.pagination;
    })
  }

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
