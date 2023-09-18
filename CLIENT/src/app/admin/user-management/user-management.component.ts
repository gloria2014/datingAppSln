import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { RolesModalComponent } from 'src/app/modals/roles-modal/roles-modal.component';
import { User } from 'src/app/_models/user';
import { AdminService } from 'src/app/_services/admin.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {

  users: User[] = [];
  bsModalRef: BsModalRef<RolesModalComponent> = new BsModalRef<RolesModalComponent>();

  availableRoles = ['Admin','Moderator','Member'] 

  constructor(private adminService:AdminService, private modalService:BsModalService) { }

  ngOnInit(): void {
    this.getUsersWithRoles();
  }

  getUsersWithRoles() {
    this.adminService.getUsersWithRoles().subscribe(users => {
      this.users = users;
    })
  }
  
  openRolesModal(user: User){
    const config = {
      class:'modal-dialog-centered',
      initialState:{
        username:user.username,
        availableRoles: this.availableRoles,
        selectedRoles: [...user.roles]
      }
    }
    this.bsModalRef = this.modalService.show(RolesModalComponent,config);
    this.bsModalRef.onHide?.subscribe({
      next:() => {
        const selectedRoles = this.bsModalRef.content?.selectedRoles;
        if(!this.arrayEqual(selectedRoles!, user.roles)){
            this.adminService.updateUserRoles(user.username, selectedRoles!)
            .subscribe({
              next: roles => roles
            })
        }
      }
    });
  }

  private arrayEqual(arr1:any[], arr2:any[]){
    return JSON.stringify(arr1.sort()) === JSON.stringify(arr2.sort());
  }

  // openRolesModal(user: User) {
  //   const config = {
  //     class: 'modal-dialog-centered',
  //     initialState: {
  //       user,
  //       roles: this.getRolesArray(user)
  //     }
  //   }
  //   this.bsModalRef = this.modalService.show(RolesModalComponent, config);
  //   this.bsModalRef.content.updateSelectedRoles.subscribe(values => {
  //     const rolesToUpdate = {
  //       roles: [...values.filter(el => el.checked === true).map(el => el.name)]
  //     };
  //     if (rolesToUpdate) {
  //       this.adminService.updateUserRoles(user.username, rolesToUpdate.roles).subscribe(() => {
  //         user.roles = [...rolesToUpdate.roles]
  //       })
  //     }
  //   })
  // }
}
