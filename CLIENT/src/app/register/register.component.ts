import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Event } from 'ngx-bootstrap/utils/facade/browser';
import { AccountService } from '../_services/account.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  /* decorador de entrada @Input() */
  // @Input() usersFromHomeComponent:any; // aca el @Input() recibirá todos los datos del compnente home
 /* decorador de salida */
  @Output() cancelRegister = new EventEmitter();
  model:any = {};

  constructor(private cuentaServicio:AccountService) { }

  ngOnInit(): void {
  }
register(){
  this.cuentaServicio.register(this.model).subscribe(response =>{
    console.log(response);
    this.cancel();
  }, error =>{
    console.log(error);
  }
  )
}
cancel(){
  //console.log("cancelado");
  this.cancelRegister.emit(false);
}
}
