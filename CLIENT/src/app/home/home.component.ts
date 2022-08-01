import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  registerMode = false;
  //users: any;
  // constructor(private http: HttpClient) { }
  constructor() { }

  ngOnInit(): void {
    // this.getUsers();
  }

  registerToggle(){
    this.registerMode = !this.registerMode; // lo seteo a false
  }
  // getUsers(){
  //   this.http.get("https://localhost:7071/Users")
  //   .subscribe(users => this.users = users);
  // }

  cancelRegisterMode(evento:boolean){
    this.registerMode = evento;
  }
  /* otro ejemplo de llamado*/
//   getUsers(){
//   this.http.get('https://localhost:7071/Users').subscribe(response => {
//     this.users = response;
//   },error => {
//     console.log(error);
//   });
// }
}
