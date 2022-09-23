import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
// import { stringify } from 'querystring';
import{map} from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl; //"https://localhost:7071/";

  /* se obtiene datos del usuario en observable currentUserSource  */
  private currentUserSource = new ReplaySubject<User>(1);
  
  /*currentUser$ cuando hay un signo dolar delante de la variable significa 
  que recibirá datos de un observable*/
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http:HttpClient) { }

  login(model:any){
    return this.http.post(this.baseUrl+'Account/login', model).pipe(
      map((response: User)=>{
        const user = response;
        if(user){
          // this.currentUserSource.next(user);
          /* clase 136 se cambia la llamada a est afuncion -> setCurrentUser() */
          this.setCurrentUser(user);
          console.log("accountService/login :::: " + JSON.stringify(user));
          
        }
      })
    );
  }
  
  /* clase 136 usaremos este método para configurar al usuario actual. se agrega aqui el localstorage del user */
  setCurrentUser(usuario:User){
    localStorage.setItem("usuario2",JSON.stringify(usuario));
    this.currentUserSource.next(usuario);
  }

  logout(){
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }
   register(model: any){
      return this.http.post(this.baseUrl+"account/register",model).pipe(
        map((usuario: User)=>{
          if(usuario){
             // this.currentUserSource.next(usuario);
               /* clase 136 se comenta la linea de arriba y se cambia la llamada a est afuncion -> setCurrentUser() */
          this.setCurrentUser(usuario);
          }
          return usuario;
        })
      )
   }

}
