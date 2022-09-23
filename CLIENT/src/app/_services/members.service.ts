import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';

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

  /* clase 123 se mejora el loding*/
  membersObs:Member[] = [];

  constructor(private http:HttpClient) { }

  getMembers(){
    // clase 109, 
    // retorna un objeto.- return this.http.get<Member[]>(this.baseUrl + 'users',this.httpOptions);
   
    /* clase 123 ahora se devuelve un observable. para eso se aggrega condicional if */
    if(this.membersObs.length > 0) return of(this.membersObs);

    // clase 123 si no hay membersObs entonces va a la api y trae la data en observable 
    return this.http.get<Member[]>(this.baseUrl + 'users').pipe(
      map(memberMap => {
          this.membersObs = memberMap;
          return this.membersObs;
      })
    )
  }

  getMember(username:string){
    console.log("memberService :: " + username);
    // clase 109,  return this.http.get<Member>(this.baseUrl + "users/" + username, this.httpOptions);
     
    /* clase 123 obtiene un member de la lista membersObs */
    const member = this.membersObs.find( x => x.username === username);
    if(member !== undefined)return of(member);

    return this.http.get<Member>(this.baseUrl + "users/" + username);
  }
  
  /* clase 121 se crea el método update */
  updateMember(memberParam: Member){
    //return this.http.put(this.baseUrl + "users", memberParam);

    /* clase 123 se agrega el pipe */
    return this.http.put(this.baseUrl + "users", memberParam).pipe(
      map(() => {
        const index = this.membersObs.indexOf(memberParam);
        this.membersObs[index] = memberParam;
      })
    )
  }

  setMainPhoto(photoId: number){
    return this.http.put(this.baseUrl + "users/set-main-photo/" + photoId, {});
  }
  /* clase 139 se agrega me´todo delete foto */
  deletePhoto(photoId : number){
    return this.http.delete(this.baseUrl + "users/delete-photo/" + photoId);
  }
}
