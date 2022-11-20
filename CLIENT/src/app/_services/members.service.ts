import { HttpClient, HttpParams,  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, of, pipe, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Clave } from '../_models/clave';
// import * as internal from 'stream';
import { Member } from '../_models/member';
import { PaginatedResult } from '../_models/pagination';
import { User } from '../_models/user';
import { UserParams } from '../_models/userParams';
import { AccountService } from './account.service';

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
 /*  clase 157 se agrega la propiedad resultadoPagina de tipo PaginatedResult<> 
 en esta propiedad guardaremos los resulytados */
  //paginatedResult: PaginatedResult<Member[]> = new PaginatedResult<Member[]>(); clase 161 se mueve esta linea al metodo getPaginatedResult
  
  /* clase 168se agrega variable tipo Map() */
  memberCache = new Map();
  usuario :User; 
  userParams: UserParams; 

     /* clase 170 Se trae el contenido del constructor member-list.ts al constructor de este servicio
    Se crea 3 metodos: getUserParams() que devuelve los operandos de inicio de sesión
    y setUserParams() y resetUserParams() */
  constructor(private http:HttpClient,  private accountService:AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.usuario = user;
      this.userParams = new UserParams(user);
    })
   }
    getUserParams(){
      return this.userParams;
    }
    setUserParams(params:UserParams){
        this.userParams = params;
    }
    resetUserParams(){
      this.userParams = new UserParams(this.usuario);
      return this.userParams;
    }

  // getMembers(){  /*  clase 157 se comenta este metodo */
  //   // clase 109, 
  //   // retorna un objeto.- return this.http.get<Member[]>(this.baseUrl + 'users',this.httpOptions); 
  //   /* clase 123 ahora se devuelve un observable. para eso se aggrega condicional if */
  //   if(this.membersObs.length > 0) return of(this.membersObs);
  //   // clase 123 si no hay membersObs entonces va a la api y trae la data en observable 
  //   return this.http.get<Member[]>(this.baseUrl + 'users').pipe(
  //     map(memberMap => {
  //         this.membersObs = memberMap;
  //         return this.membersObs;
  //     })
  //   )
  // }

 /* clase 157 PAGINACION se comenta el metodo getMembers() poruqe se modifica */
//  getMembers_160(page?:number, itemsPerPage?:number){
//   let params = new HttpParams();
//   /* clase 157 verificamos 2 veces para ver si tenemos la pagina y que no se a igual */
//   if(page !== null && itemsPerPage !== null){
//       params = params.append('pageNumber',page.toString());
//       params = params.append('pageSize', itemsPerPage.toString());
//   }
//   return this.http.get<Member[]>(this.baseUrl + 'users', { observe: 'response', params }).pipe(
//     map(response => {
//       this.paginatedResult.result = response.body;
//       if (response.headers.get('Pagination') !== null) {
//         this.paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
//       }
//       return this.paginatedResult;
//     })
//   );
//  }

 /* clase 161 se modifica el metodo getMembers(){}  Ahora se le pasa el objeto UserParmas como parámetro de entrada */
 getMembers(userParams: UserParams){
 
  /* clase 168 en esta clase devolveremos los members con formato key=value y lo guardaremos en la memoria.
  El object Map se usa como un dictionary con formato key=value Donde el value es lo que 
  viene del servidor y el key es lo que vemos del console.log */
 console.log("clase 168 ::" + Object.values(userParams).join('-')); //esto viene  18-99-1-24-lastActive-male
 
 var response = this.memberCache.get(Object.values(userParams).join('-'));


 console.log("respuesta getMembers() :: " + response);

 if(response){
    return of (response);
 }

  let params = this.getPaginationHeaders(userParams.pageNumber, userParams.pageSize);

  params = params.append('minAge', userParams.minAge.toString());
  params = params.append('maxAge', userParams.maxAge.toString());
  params = params.append('gender', userParams.gender);
  params = params.append('orderBy', userParams.orderBy);

  return this.getPaginatedResult<Member[]>(this.baseUrl + 'users', params)
  pipe(map(response =>{
    this.memberCache.set(Object.values(userParams).join('-'),response);
    return response;
  })) /* clase 168 usamos la funcion de Map para transformar los datos que vienen del response.
  al tener la respuesta dentro del pipe(map(response)) nos detenemos y agregamos el key y el vlaue 
  en nuestra response y retornamos el response
  */
 }

 /* clase 161 se refactoriza este pedazo de codigo del me´todo getMembers_160 y se convierte en un método  */
 private getPaginatedResult<T>(url, params) {
   const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();

  return this.http.get<T>(url, { observe: 'response', params }).pipe(
    map(response => {
      paginatedResult.result = response.body;
      if (response.headers.get('Pagination') !== null) {
        paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
      }
      return paginatedResult;
    })
  );
}

 private getPaginationHeaders(pageNumber:number, pageSize:number){
  let params = new HttpParams();
      params = params.append('pageNumber',pageNumber.toString());
      params = params.append('pageSize', pageSize.toString());
  return params;
 }

  getMember(username:string){
    console.log("memberService :: " + username);
    // clase 109, se comenta:  return this.http.get<Member>(this.baseUrl + "users/" + username, this.httpOptions);
     
    /* clase 123 obtiene un member de la lista membersObs */
    // const member = this.membersObs.find( x => x.username === username);
    // if(member !== undefined)return of(member);

    /* clase 169 se comenta las lineas anteriores poruqe la consulta se hará ahora a la cache no a la bd */
    console.log("clase 169 :: "+ this.memberCache);

    const member = [...this.memberCache.values()]
    .reduce((arr,elem) => arr.concat(elem.result),[])
    .find((member: Member) => member.username === username);
    console.log("clase 1692 :: "+ member);

    if (member) {
      return of(member);
    }

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
// ACA ME QUEDE FALTA COMPELTAR EL METODO DEL SERVICO Y LUEOG PROBAR EN LA API
  recuperarClave(memberParam: Clave){
    // return this.http.put(this.baseUrl + "users", memberParam).pipe(
    //   map(() => {
    //     const index = this.membersObs.indexOf(memberParam);
    //     this.membersObs[index] = memberParam;
    //   })
    // )
  }


  setMainPhoto(photoId: number){
    return this.http.put(this.baseUrl + "users/set-main-photo/" + photoId, {});
  }
  /* clase 139 se agrega me´todo delete foto */
  deletePhoto(photoId : number){
    return this.http.delete(this.baseUrl + "users/delete-photo/" + photoId);
  }
}
