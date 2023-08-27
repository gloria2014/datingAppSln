import { Component, Injectable, OnInit } from '@angular/core';
import { take } from 'rxjs';

import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';
import { ToastrService } from 'ngx-toastr';
import { Clave } from 'src/app/_models/clave';

@Component({
  selector: 'app-member-clave',
  templateUrl: './member-clave.component.html',
  styleUrls: ['./member-clave.component.css']
})


export class MemberRecuperaClaveComponent implements OnInit {
  
  // objClave:Clave;
  public insertClave : null;
  useractual:User;



  constructor(private accountService:AccountService, 
    private membersService:MembersService,private toastr:ToastrService) {
    this.accountService.currentUser$
    .pipe(take(1)).subscribe(user => this.useractual = user);
   }

  ngOnInit(): void {

  }

 

  recuperarClave(){
    console.log(this.insertClave);
    // this.membersService.updateMember(this.objClave).subscribe(() =>{
    //   this.toastr.success("Profile update successfully");
     // this.editForm.reset(this.memberedita);
    //})
  }
}
