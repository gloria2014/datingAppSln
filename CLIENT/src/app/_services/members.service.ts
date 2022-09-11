import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';

// calse 104 se agrega constante para obtener el token temporalmente
// const httpOptions = {
//   headers : new HttpHeaders({
//     Authorization : 'Bearer ' + JSON.parse(localStorage.getItem('user')).token 
//   })
  
// }

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  // clase 104 se agrega la url desde el enviroment
  baseUrl = environment.apiUrl;
/* clase 104 se cambia la llamada del token se coloca dentro de la clase */
/* clase 109 se saca de aca la generació del token y se le pasa al itercpetor jwt.interceptor.ts */
  // httpOptions = {
  //   headers: new HttpHeaders({
  //     Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token
  //   })
  // };

  constructor(private http:HttpClient) { }

 

  getMembers(){
    // clase 109,  return this.http.get<Member[]>(this.baseUrl + 'users',this.httpOptions);
    return this.http.get<Member[]>(this.baseUrl + 'users');
  }

  getMember(username:string){
    console.log("memberService :: " + username);
    // clase 109,  return this.http.get<Member>(this.baseUrl + "users/" + username, this.httpOptions);
     return this.http.get<Member>(this.baseUrl + "users/" + username);

    //return this.http.get<Member>(this.baseUrl + "users/ana");
  }
  
}
