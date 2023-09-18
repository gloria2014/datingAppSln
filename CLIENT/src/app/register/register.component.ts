import { visitAll } from '@angular/compiler';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Event } from 'ngx-bootstrap/utils/facade/browser';
import { ToastrService } from 'ngx-toastr';
// import { threadId } from 'worker_threads';
import { AccountService } from '../_services/account.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Output() cancelRegister = new EventEmitter();

  formularioRegistro: FormGroup;
  fechaLimite :Date;

  validacionErrores: string[] = []; 

  constructor(private cuentaServicio: AccountService, private toastr: ToastrService,
    private fb:FormBuilder, private enrutador:Router) { }

  ngOnInit(): void {
    this.initializeForm();
    this.fechaLimite = new Date();
    this.fechaLimite.setFullYear(this.fechaLimite.getFullYear() -18);
  }

  
  initializeForm(){
    this.formularioRegistro = this.fb.group({
      gender : ['male'],
      username : ['',Validators.required],
      knownAs : ['',Validators.required],
      dateOfBirth : ['',Validators.required],
      city : ['',Validators.required],
      country : ['',Validators.required],
      password:['',[Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword : ['',[Validators.required, this.matchValues('password')]]
    })
  }


  matchValues(coincidirCon:string):ValidatorFn{
    return (control: AbstractControl)=>{
      return control?.value == control.parent?.controls[coincidirCon].value?
       null: {isMatching: true}
    }
  }

 
     register() {
      console.log(this.formularioRegistro.value);
      this.cuentaServicio.register(this.formularioRegistro.value).subscribe(response => {
        this.enrutador.navigateByUrl("/members")
      }, error => {
        console.log(error);
         this.validacionErrores = error;
      }
      )
    }

  cancel() {

    this.cancelRegister.emit(false);
  }
}
