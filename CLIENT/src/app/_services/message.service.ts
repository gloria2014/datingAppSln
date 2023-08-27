import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Message } from '../_models/message';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl = environment.apiUrl;

  constructor(private http:HttpClient) { }

  getMessages(pageNumber:number, pageSize:number, container:string){

    console.log('message.sesrvice.ts -> pageNumber : ' + pageNumber, 'pageSize : '+pageSize);

      let params = getPaginationHeaders(pageNumber,pageSize);
      params = params.append('Container',container);
      return getPaginatedResult<Message[]>(this.baseUrl+'messages',params,this.http);
  }

  getMessageThread(username: string){  
    console.log('username :' + username);  
    return this.http.get<Message[]>(this.baseUrl +'messages/thread/'+ username);
  }

  // async sendMessage(username: string, content: string) {
  //   return this.hubConnection.invoke('SendMessage', {recipientUsername: username, content})
  //     .catch(error => console.log(error));
  // }
}
