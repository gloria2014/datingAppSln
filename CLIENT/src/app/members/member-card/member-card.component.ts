import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {
  /* clase 106 .- se agrega una propiedad de entrada que recibirá los datos de su padre
  member-list */
  @Input() memberpadre:Member;

  constructor(private memberService:MembersService, private toast:ToastrService) { }

  ngOnInit(): void {
  }

  addLike(member:Member){
      this.memberService.addLike(member.username).subscribe(()=>{
        this.toast.success('You have liked' + member.knownAs);
      });
  }
}
