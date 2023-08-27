import { Component, Input, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { Member } from 'src/app/_models/member';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { environment } from 'src/environments/environment';
import { take } from 'rxjs/operators';
import { MembersService } from 'src/app/_services/members.service';
import { Photo } from 'src/app/_models/photo';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {

  @Input() padreMemberEditaFoto: Member;

  /* clase 133 se agrega funcnionalidad subir foto */
  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  
  baseUrl = environment.apiUrl;
  usuario: User;
  constructor(private acountService: AccountService, private memberService:MembersService) {
    /*  clase 133 (1) aca vamos a obtener al usuario actual de los observables */
    this.acountService.currentUser$.pipe(take(1))
      .subscribe(user => this.usuario = user);

  }

  ngOnInit(): void {
    this.initializeUploader();
  }

  fileOverBase(e: any) {
    this.hasBaseDropZoneOver = e;
  }
  initializeUploader() {
    /*  clase 133 (2) aca vamos a agregar las propiedades de configuracion del FileUploader (del cargador) */
    this.uploader = new FileUploader({
      url: this.baseUrl + "users/add-photo",
      authToken: "Bearer " + this.usuario.token,
      isHTML5: true,
      allowedFileType: ["image"],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });
    /* clase 133 (3) ademas neccesitamos setear la credencial en false  */
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    }

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if(response){
          const foto:Photo = JSON.parse(response);
          this.padreMemberEditaFoto.photos.push(foto);
          /* clase 151 valido si la foto actual es la foto principal, seteo la foto en los objetos User y Member */
          if(foto.isMain){
            this.usuario.photoUrl = foto.url;
            this.padreMemberEditaFoto.photoUrl = foto.url;
            /*accedemos al accountService y establecemos agregar usuario actual (debiera actualizar la foto de todas las páginas) */
            this.acountService.setCurrentUser(this.usuario);
          }

      }
    }
  }

  /* clase 137 se agrega el metodo setMainPhoto() */
  setMainPhoto(foto: Photo){
    this.memberService.setMainPhoto(foto.id).subscribe(() =>{
      this.usuario.photoUrl = foto.url;
      this.acountService.setCurrentUser(this.usuario);
      this.padreMemberEditaFoto.photoUrl = foto.url;
      this.padreMemberEditaFoto.photos.forEach(p => {
          if(p.isMain) p.isMain = false;
          if(p.id === foto.id) p.isMain = true;
      })
    })
  }

  /* clase 139 se crea método que elimina foto */
  deletePhoto(fotoId:number){
    this.memberService.deletePhoto(fotoId).subscribe(() =>{
      // despues que elimina la foto, obtengo las fotos que no tengan el idfoto de param emtrada
      this.padreMemberEditaFoto.photos = this.padreMemberEditaFoto.photos
      .filter(x => x.id !== fotoId);
    })
  }
}
