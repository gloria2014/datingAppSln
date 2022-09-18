import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
 /* clase 116 obtener al usuario actual desde el observable */
  memberedita:Member;
  useractual:User;

 /* clase 118 se agrega un selector hijo llamado "editForm" de tipo NgForm para tener acceso al formulario edit */
  @ViewChild("editForm") editForm :NgForm;

  /*  clase 119 agrega listenerHost para contraolar la navegacion entre navegadores o pestañas */
  @HostListener('window:beforeunload',['$event']) unloadNotification($event:any){
      if(this.editForm.dirty){
          $event.returnValue = true;
      }
  }

  constructor(private accountService:AccountService
    , private membersService:MembersService, private toastr:ToastrService) {
    /* clase 116 obtenemos al usuario actual del account.service*/
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.useractual = user);
  }

  ngOnInit(): void {
    this.loadMember();
  }
  /* clase 116 se crea método que trae los datos del usuario logeado */
  loadMember(){
    console.log("entre edit ::: ");
      this.membersService.getMember(this.useractual.username).subscribe(member => {
      this.memberedita = member;
    })
  }
  /* clase 118 se agrega el método para actualizar al usuario
  se inyecta el ToastrService para mostrar los mensajes.
  clase 121 se agrega la llamada al servicio y se suscribe el método */
  updateMember(){
    console.log(this.memberedita);
    this.membersService.updateMember(this.memberedita).subscribe(() =>{
      this.toastr.success("Profile update successfully");
      this.editForm.reset(this.memberedita);
    })

   
  }
}
