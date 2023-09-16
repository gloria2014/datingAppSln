import { Component, OnInit } from '@angular/core';
import { Message } from '../_models/message';
import { Pagination } from '../_models/pagination';
import { MessageService } from '../_services/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})

/* esta clase se ejecuta al presionar la pestaña Mensajes del menu */
export class MessagesComponent implements OnInit {
 mensajesPadre?:Message[];
 paginacion?: Pagination;
 container = 'Unread';
 pageNumber = 1;
 pageSize = 5;
 loading = false; // class 198 

  constructor(private mensajeServicio:MessageService) { }

  ngOnInit(): void {
    this.loadMessages();
  }
  loadMessages(){
    this.loading = true; /* cuando se llame por 1ra vez sera true */
    console.log('message.component.ts -> pageNumber : ' + this.pageNumber, 'pageSize : '+ this.pageSize);
    
    this.mensajeServicio.getMessages(this.pageNumber,this.pageSize,this.container).subscribe({
      next:response =>{
        this.mensajesPadre = response.result;
        this.paginacion = response.pagination;
        this.loading = false;
      }
    });
  }

  pageChanged(event:any){
    if(this.pageNumber !== event.page){
      this.pageNumber = event.page;
      this.loadMessages();
    }

  }

  deleteMessage(id:number){
    this.mensajeServicio.deleteMessage(id).subscribe({
      next:()=> this.mensajesPadre?.splice(this.mensajesPadre.findIndex(m => m.id == id),1)
    })
  }
}
