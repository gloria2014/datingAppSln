import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
// import { stringify } from 'querystring';
import{map} from 'rxjs/operators';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = "https://localhost:7071/";

  /* se obtiene datos del usuario en observable currentUserSource  */
  private currentUserSource = new ReplaySubject<User>(1);
  
  /*currentUser$ cuando hay un signo dolar delante de la variable significa 
  que recibirá datos de un observable*/
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http:HttpClient) { }

  login(model:any){
    return this.http.post(this.baseUrl+'Account/Login', model).pipe(
      map((response: User)=>{
        const user = response;
        if(user){
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
        }
      })
    );
  }

  setCurrentUser(user:User){
    this.currentUserSource.next(user);
  }

  logout(){
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }
   register(model: any){
      return this.http.post(this.baseUrl+"account/register",model).pipe(
        map((usuario: User)=>{
          if(usuario){
              localStorage.setItem("usuario2",JSON.stringify(usuario));
              this.currentUserSource.next(usuario);
          }
          return usuario;
        })
      )
   }
}