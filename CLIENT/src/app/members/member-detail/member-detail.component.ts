import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { Member } from 'src/app/_models/member';
import { Message } from 'src/app/_models/message';
import { MembersService } from 'src/app/_services/members.service';
import { MessageService } from 'src/app/_services/message.service';


@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})

/*  ESTA CLASE member-detail SE CARGA DESPUES DE HACER CLIC SOBRE LA FILA DE LA LISTA DE MENSAJES QUE 
VIENE DE HACER CLIC A LA PESTAÑA "MENSAJES" (corresponde al componete messages.ts) ->  https://localhost:4200/members/todd 

ORDEN DE LLAMADO DE COMPOENTES
 1->messages.ts(carga lista de mensajes de todos los usuarios)
 2-> member-detail.ts(carga lista de mesnajes de un usuario) 
 3-> member-messages.ts(es la vista final) */

 export class MemberDetailComponent implements OnInit {
    /* class 194 - se agrega una variable de referencia '#memberTabs' en su html y 
    que viene hacer el hijo de este componente. Luego creo el método 'onTabActivated()' */

    @ViewChild('memberTabs', {static: true}) memberTabs: TabsetComponent;

    member: Member;// = {} as Member; // | undefined;
    // images: galleryItem[] = [] no se encuentresta solo en el ejemplo video
    activeTab: TabDirective;
    mensajes: Message[] = [];

  /* clase 113 se agrega ngx-gallery para agregar foto */
   galleryOptions: NgxGalleryOptions[];
   galleryImages: NgxGalleryImage[];


  // messages: Message[] = [];

  constructor(private memberService:MembersService, 
    private messageService: MessageService, 
  private route:ActivatedRoute) { }

  ngOnInit(): void {
    /* class 196 - en esta clase se agrega el resolver(los resolver estan asociados 
      con las paths) Entonces, aqui comentamos el loadMember porque usaremos el resolver MemberDetailedResolver
       */
     //this.loadMember();

 
    this.route.data.subscribe(
      data => {this.member = data.member}
    );

    this.route.queryParamMap.subscribe(
       param =>{
        param['tab'] && this.selectTab(param['tab'])
      }
    );

    // this.galleryOptions = [
    //   {
    //     width: '500px',
    //     height: '500px',
    //     imagePercent: 100,
    //     thumbnailsColumns: 4,
    //     imageAnimation: NgxGalleryAnimation.Slide,
    //     preview: false
    //   }
    // ]
    // this.galleryImages = this.getImages();
    this.getImages();
  }
/*  clase 113 se crea metodo que cargue las fotos */
  getImages(): NgxGalleryImage[]{
    const imageUrls = [];
    for(const photo of this.member.photos){
        imageUrls.push({
          small:photo?.url,
          medium:photo?.url,
          big:photo?.url
        });
    }
    return imageUrls;
  }

  /* clase 110 agrega metodo loadMemeber y la pasa como param de entrada el username en la 
  la llamada gethttp */

  /* loadMemeber ya no se usa, se remplaza poor el resolver*/
  loadMember(){ 
    console.log("entre loadMember");
    const username = this.route.snapshot.paramMap.get('username');
    if(!username) return;

      this.memberService.getMember(username)
      .subscribe({
        next:member => {
          this.member = member;
          /* clase 113 se agrega aca el llamado a la carga de las fotos */
          this.getImages();
        }
      })
   }

   /* class 194 se crea este metodo para que solo se active cuando hace clic en la pestaña Messages.
    se busca por su propiedad heading 'Messages' del html */
    onTabActivated(data : TabDirective){
      this.activeTab = data;
      if(this.activeTab.heading === 'Messages'){
          this.loadMessages();
      }
   }

   loadMessages(){
    if(this.member){
       this.messageService.getMessageThread(this.member.username)
      .subscribe(
       mensajes => {this.mensajes = mensajes}
      );
    }
  }
  
/*  class 195 se crea este metdo selectTab() */
  selectTab(heading:string){
    if(this.memberTabs){
      this.memberTabs.tabs.find(x => x.heading == heading)!.active = true;
    }
  }
}
