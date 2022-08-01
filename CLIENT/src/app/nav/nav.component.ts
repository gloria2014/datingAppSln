import { Component, OnInit } from '@angular/core';
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
  constructor(public accountService: AccountService) { }

  ngOnInit(): void {
  // this.getCurrentUser();
   //this.currentUser$ = this.accountService.currentUser$; // luego elimminar esta linea
  }

  login(){
    this.accountService.login(this.model).subscribe(response =>{
      console.log(response);
      //this.loggedIn = true;
    }, error =>{
      console.log(error);
    })  
  }
  logout(){
    this.accountService.logout(); 
    /*
     luego verificar si el servicio account es observable para ello se crea un 
     método temporal getCurrentUser(){} -> mas adalente este método será eliminado 
    */
    //this.loggedIn = false;
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
