import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { take } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { Message } from 'src/app/_models/message';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';
import { MessageService } from 'src/app/_services/message.service';
import { PresenceService } from 'src/app/_services/presence.service';


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

 export class MemberDetailComponent implements OnInit, OnDestroy {
    /* class 194 - se agrega una variable de referencia '#memberTabs' en su html y 
    que viene hacer el hijo de este componente. Luego creo el método 'onTabActivated()' */

    @ViewChild('memberTabs', {static: true}) memberTabs: TabsetComponent;

    member: Member;
    activeTab: TabDirective;
    mensajes: Message[] = [];

   galleryOptions: NgxGalleryOptions[] = [];
   galleryImages: NgxGalleryImage[] = [];
  usuario?: User;

  constructor(private accountService:AccountService, 
    private messageService: MessageService, public presenceService:PresenceService,
  private route:ActivatedRoute) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user =>{
        if(user) this.usuario = user;
      }
    })
  }

  ngOnInit(): void {
    this.route.data.subscribe(
      data => {this.member = data['member']}
    );
    this.route.queryParams.subscribe(
      param => {
        param['tab'] && this.selectTab(param['tab'])
      }
    );
    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
      }
    ]
    this.galleryImages = this.getImages();
  }

  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
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

  // loadMember(){ 
  //   console.log("entre loadMember");
  //   const username = this.route.snapshot.paramMap.get('username');
  //   if(!username) return;

  //     this.memberService.getMember(username)
  //     .subscribe({
  //       next:member => {
  //         this.member = member;
  //         /* clase 113 se agrega aca el llamado a la carga de las fotos */
  //         this.getImages();
  //       }
  //     })
  //  }

    onTabActivated(data : TabDirective){
      this.activeTab = data;
      if(this.activeTab.heading === 'Messages' && this.usuario){
          //this.loadMessages();
          this.messageService.createHubConnection(this.usuario, this.member.username);
      }else{
        this.messageService.stopHubConnection();
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
  

  selectTab(heading:string){
    if(this.memberTabs){
      this.memberTabs.tabs.find(x => x.heading == heading)!.active = true;
    }
  }
}
