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
  /* decorador de entrada @Input() */
  // @Input() usersFromHomeComponent:any; // aca el @Input() recibirá todos los datos del compnente home

  /* decorador de salida */
  @Output() cancelRegister = new EventEmitter();
  //model: any = {};  /* clase 151 se comenta la propiedad del model ya que usaremos reactforms */

  /* clase 142 se crea una propiedad "formularioRegistro" de tipo FormGroup */
  formularioRegistro: FormGroup;
  /* clase 149 se agrega propiedad fecha para controlar la selección de fecha */
  fechaLimite :Date;
  /* clase 151 se carea propiedad validacionErrores para manejar los errores */
  validacionErrores: string[] = []; /* se debe inicializar el arrary porque en el html valida el lenght > 0 sino se cae */

  constructor(private cuentaServicio: AccountService, private toastr: ToastrService,
    private fb:FormBuilder, private enrutador:Router) { }

  ngOnInit(): void {
    this.initializeForm();
    this.fechaLimite = new Date();
    this.fechaLimite.setFullYear(this.fechaLimite.getFullYear() -18);
  }

  /* clase 142 se crea un método que contenga los controles de form dentro del groupforms  

  clase 147 se cambia de nombre el método initializeForm() a   initializeForm_original()
     porque se hará varios cambios, ahora se convertirá  en un formiulario de form builder 
  */
  // initializeForm_original(){
  //   this.formularioRegistro = new FormGroup({
  //       username: new FormControl('',Validators.required),
  //       password: new FormControl('',[Validators.required,Validators.minLength(2),Validators.maxLength(4)]),
  //       confirmPassword:new FormControl('', [Validators.required, this.matchValues('password')])
  //   })
  //   /* clase 142 si cambia la clave despeus de haber validado la clave confirmada, lo que encontrará es que no es 
  //   inválido el formulario, e spor eso que necesitamos agregar un paso dentro del metodo del formulario de inicialización 
  //   Actualmente el validador de clave confirmada solo aplica  a la clave onfirmada "confirmPassword:new FormControl('', [Validators.required, this.matchValues('password')])"
  //   lo que hay que hacer es, volver a comporbar el campo de la clave y actualizar si es válida contra la clave confirmada
  //    */
  //   this.formularioRegistro.controls.password.valueChanges.subscribe(() =>{
  //     this.formularioRegistro.controls.confirmPassword.updateValueAndValidity();
  //   })
  // }

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

  /* clase 144 agregamos la función "matchValue"que valida que sean iguales las claves y
   retorna una validacion de función "ValidatorFn" LLamamos esta función dentro de la validación de "confirmPassword" */
  matchValues(coincidirCon:string):ValidatorFn{
    return (control: AbstractControl)=>{
      return control?.value == control.parent?.controls[coincidirCon].value?
       null: {isMatching: true}
    }
  }

      /*  clase 151 se comenta y cambia de nombre porque se modifica */
  // register_original() {
  //   console.log(this.formularioRegistro.value);
  //   this.cuentaServicio.register(this.model).subscribe(response => {
  //     console.log(response);
  //     this.cancel();
  //   }, error => {
  //     console.log(error);
  //     this.toastr.error(error.error);    
  //   })
  // }

    /*  clase 151 cuando el usuario se registre lo redireccianeremos a la pantalla de
     members es por eso que, debemos inyectar el enrutador, este lo que hará es 
     redireccionar desde regsiter a member(porque aca se inserta)
    Tambien de usar el ngModel usaremos formulario reactivo "formularioRegistro" */
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
    //console.log("cancelado");
    this.cancelRegister.emit(false);
  }
}
