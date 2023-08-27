import { Component, Input, OnInit, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.css']
})

/* clase 146 se crea esta clase para controlar y validar los controles del formulario en este 
caso el formulario de registro. E implementar los 3 meotodos correspondientes a ControlValueAccessor 
(aunque no los utilzaremos pero nos pide implementarlos)*/
export class TextInputComponent implements ControlValueAccessor {

  /* agregamos 2 propiedades de entrada que recibiran los valores de los controles y su tipo por defecto el tipo será text, 
  ya desde el html le envia otro tipo si es .*/
  @Input() label :string;
  @Input() type: 'text';

  /* inyectamos el control en su constructor, irá un decorador especial llamado "Self" */
  constructor(@Self() public controladorTextInput:NgControl){
      this.controladorTextInput.valueAccessor = this;
   }

  writeValue(obj: any): void {}
  registerOnChange(fn: any): void {}
  registerOnTouched(fn: any): void {}
 

  /* clase 146 eliminamos el m´todo ngOninit porque ya no lo implementaremos */
  // ngOnInit(): void {}
    
  

}
