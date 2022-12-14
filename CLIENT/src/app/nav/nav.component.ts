import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {}
  // loggedIn: boolean;
 // currentUser$: Observable<User>; // luego se elimina esta linea

 /* se comentó el observable currentUser$ porque ahora se le llamará desde el constructor
 convirtiendo de private a publico
 */
  constructor(public accountService: AccountService, private router:Router, 
              private toastr:ToastrService) { }

  ngOnInit(): void {
  // this.getCurrentUser();
   //this.currentUser$ = this.accountService.currentUser$; // luego elimminar esta linea
  }

  login(){
    this.accountService.login(this.model).subscribe(response =>{
      console.log("nav/login ::: " + response);
      //this.loggedIn = true;
      this.router.navigateByUrl('/members');
       } //, error =>{ leccion 82 se quita esta validación porque ya existe una en el interceptor
    //   console.log("error del btn login :: " + error);
    //   this.toastr.error(error.error);
    // }
    )  
  }

  recuperarClave(){
    
  }

  logout(){
    this.accountService.logout(); 
    /*
     luego verificar si el servicio account es observable para ello se crea un 
     método temporal getCurrentUser(){} -> mas adalente este método será eliminado 
    */
    //this.loggedIn = false;
    this.router.navigateByUrl('/');
  }

  /* lesson 58 .- se remplaza este método por una llamada a async pipe */
  // getCurrentUser(){
  //   this.accountService.currentUser$.subscribe(user =>{
      
  //     /* las comillas dobles!! significa que, convierte al objeto usuario en mil millones
  //      Importante: el objeto user puede venir nulo o con data
  //      Entonces, cuando se usa los !![nom_objeto] y el objeto viene null significa que es false
  //      y si objeto viene con data significa que es true */
  //     this.loggedIn = !!user;
  //   }, error =>{
  //     console.log(error);
  //   })
  // }
}
