import { HttpClient, HttpParams } from "@angular/common/http";
import { map } from "rxjs/operators";
import { PaginatedResult } from "../_models/pagination";

/* class 187 se crea este archivo .TS 
aqui no se crea desde consola con ng g s -> sino mas bien click derecho,
y crea archivo en blanco. Luego se agregó estas funciones*/ 

 export function getPaginatedResult<T>(url:string, params:HttpParams, http:HttpClient) {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();
 
   return http.get<T>(url, { observe: 'response', params }).pipe(
     map(response => {
       paginatedResult.result = response.body;
       if (response.headers.get('Pagination') !== null) {
         paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
       }
       return paginatedResult;
     })
   );
 }
 
  export function getPaginationHeaders(pageNumber:number, pageSize:number){
   let params = new HttpParams();
       params = params.append('pageNumber',pageNumber.toString());
       params = params.append('pageSize', pageSize.toString());
   return params;
  }