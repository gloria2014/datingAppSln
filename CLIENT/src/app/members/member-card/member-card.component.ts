import { Component, Input, OnInit } from '@angular/core';
import { Member } from 'src/app/_models/member';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {
  /* clase 106 .- se agrega una propiedad de entrada que recibirá los datos de su padre
  member-list */
  @Input() memberpadre:Member;

  constructor() { }

  ngOnInit(): void {
  }

}
