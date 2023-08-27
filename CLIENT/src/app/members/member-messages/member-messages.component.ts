import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Message } from 'src/app/_models/message';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css'],
  
})
/* class 192 aca creamos esta clase para listar llos mensajes de un memeber 
este component member-messages es hijo del member-detail*/
export class MemberMessagesComponent implements OnInit {
   @Input() username? : string
  @Input() mensajesMemberMensaje : Message[] = [];

  // messageContent: string;
  // loading = false;

  constructor() { }

  ngOnInit(): void {
    
  }

}
