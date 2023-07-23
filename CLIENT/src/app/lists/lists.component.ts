import { Component, OnInit } from '@angular/core';
import { Member } from '../_models/member';
import { Pagination } from '../_models/pagination';
import { MembersService } from '../_services/members.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
 members:Member[] | undefined;
 predicate = 'liked';
 pageNumber = 1;
 pageSize = 5;
 paginacion : Pagination | undefined; /* | significa o uno o lo otro */

  constructor(private memberService:MembersService){
   }

  ngOnInit(): void {
    this.loadLikes();
  }

  /* class 178 se modfica el loadLikes()  */
  // loadLikes(){
  //   this.memberService.getLikes(this.predicate).subscribe({
  //     next:respuesta =>{
  //       this.members = respuesta;
  //     }
  //   });
  // }
  loadLikes(){
    this.memberService.getLikes(this.predicate, this.pageNumber, this.pageSize).subscribe({
      next:respuesta =>{
        this.members = respuesta.result;
        this.paginacion = respuesta.pagination;
      }
    });
  }
/* clase 178 se agrega este método que permitirá que la se muestre la paginacion
ahora toca llamarlo desde la vista */
  pageChanged(event:any){
    if(this.pageNumber !== event.page){
      this.pageNumber = event.page;
      this.loadLikes();
    }
}
}
