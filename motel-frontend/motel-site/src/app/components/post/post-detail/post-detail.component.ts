import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Post } from 'src/app/model/post';
import { PostService } from 'src/app/services/post.service';
import { defaultAvatar } from 'src/config';
import { ReportModalComponent } from '../../report-modal/report-modal.component';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit{


  post = new Post();
  avatar: any = defaultAvatar;

  bsModalRef?: BsModalRef;

  marker = {
    position: {
      lat: 0,
      lng: 0
    },
    options: {
      draggable: false
    } 
  }

  zoom = 15;
  center = {
      lat: 21.037376869189334,
      lng: 105.77866948660191
  };


  constructor(private postService: PostService,
    private modalService: BsModalService,
    private route: ActivatedRoute,
    private router: Router,
    private _sanitizer: DomSanitizer) {}
  
  ngOnInit(): void {
    this.route.url.subscribe(url => {
      const {id} = this.route.snapshot.params;

      this.postService.getPostById(id)
      .subscribe(data => {
        this.post = data;
        this.center.lat = this.post.accommodation.xcoordinate!;
        this.center.lng = this.post.accommodation.ycoordinate!;
        if (data.user?.b64 != null && data.user.b64 != '')
          this.avatar = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64, ' + data.user?.b64);
        else
          this.avatar = defaultAvatar;
      });
      this.marker.position = this.center
    })
  }

  openModalReport() {
    this.modalService.show(ReportModalComponent)
  }
}
