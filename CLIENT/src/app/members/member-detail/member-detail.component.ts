import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';


@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  memberdetalle : Member;
  /* clase 113 se agrega ngx-gallery para agregar foto */
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  
  constructor(private memberService:MembersService, private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.loadMember();
    this.galleryOptions = [{
      width:'500px',
      height:'500px',
      imagePercent:100,
      thumbnailsColumns:4,
      imageAnimation:NgxGalleryAnimation.Slide,
      preview:false
    }]
  }
/*  clase 113 se crea metodo que cargue las fotos */
  getImages(): NgxGalleryImage[]{
    const imageUrls = [];
    for(const photo of this.memberdetalle.photos){
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
   loadMember(){
    console.log("entre loadMember");
      this.memberService.getMember(this.route.snapshot.paramMap.get('username'))
      .subscribe(member => {
        this.memberdetalle = member;
        /* clase 113 se agrega aca el llamado a la carga de las fotos */
        this.galleryImages = this.getImages();
      })
   }
}
