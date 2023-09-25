import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, throttleTime } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  hubUrl = environment.hubUrl;
  private hubConnection? : HubConnection;
  private onLineUsersSource = new BehaviorSubject<string[]>([]);
  onlineUsers$ = this.onLineUsersSource.asObservable();

  constructor( private toastr:ToastrService, private router:Router) { }

  createHubConnection(usuario:User){
    this.hubConnection = new HubConnectionBuilder()
    .withUrl(this.hubUrl + 'presence',{
        accessTokenFactory: () => usuario.token
    })
    .withAutomaticReconnect()
    .build();

    this.hubConnection.start().catch(error => console.error(error));

    this.hubConnection.on('UserIsOnline',usuario =>{
      //this.toastr.info(usuario + " has connected :) ");
      this.onlineUsers$.pipe(take(1)).subscribe({
        next: usuarios => this.onLineUsersSource.next([...usuarios, usuario])
      })
    })

    this.hubConnection.on("UserIsOffLine", usuario =>{
      //this.toastr.warning(usuario + " has disconnected :() ");
      this.onlineUsers$.pipe(take(1)).subscribe({
        next: usuarios => this.onLineUsersSource.next(usuarios.filter(x => x !== usuario))
      })
    })

    this.hubConnection.on("GetOnlineUsers",usuario =>{
      this.onLineUsersSource.next(usuario);
    })

    this.hubConnection.on('NewMessageReceived', ({username, knownAs}) => {
      this.toastr.info(knownAs + ' has sent you a new message!')
        .onTap
        .pipe(take(1))
        .subscribe({
          next:() => this.router.navigateByUrl('/members/' + username + '?tab=Messages')
        })
        //.subscribe(() => this.router.navigateByUrl('/members/' + username + '?tab=3'));
    })
  }

  stopHubConnection(){
    this.hubConnection?.stop().catch(error => console.log(error));
  }
}
