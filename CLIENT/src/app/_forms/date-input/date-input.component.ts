import { Component, Input, OnInit, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.css']
})

/* clase 148 se crea componente reutilizable date-input  */
export class DateInputComponent implements  ControlValueAccessor{
 /* clase 148 creamos 2 propiedades de entrada  y se inyecta un decorador como parámetro*/
 @Input() labelCalendario:string;
 @Input() fechaMaxima:Date;
 /* clase 148 tambien agregar la propiedad "bsConfig" de tipo "BsDatepickerConfig"
 cualquier opción de "BsDatepickerConfig" es opcional Si no se antepone "Partial"
 se debe de usar todas las opciones de configuración */
 bsConfig:Partial<BsDatepickerConfig>;

  constructor(@Self() public controladorCalendarioInput: NgControl ) {
    this.controladorCalendarioInput.valueAccessor = this;
    this.bsConfig = {
      containerClass:"theme-red",
      dateInputFormat:"DD-MM-YYYY"
    }
   }

  writeValue(obj: any): void { }
  registerOnChange(fn: any): void {}
  registerOnTouched(fn: any): void {}


}
