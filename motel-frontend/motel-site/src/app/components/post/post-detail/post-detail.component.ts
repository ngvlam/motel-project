import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Post } from 'src/app/model/post';
import { PostService } from 'src/app/services/post.service';
import { defaultAvatar } from 'src/config';
import { ReportModalComponent } from '../../report-modal/report-modal.component';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit{


  post = new Post();
  avatar: any = defaultAvatar;

  bsModalRef?: BsModalRef;

  constructor(private postService: PostService,
    private modalService: BsModalService,
    private route: ActivatedRoute,
    private router: Router) {}
  
  ngOnInit(): void {
    this.route.url.subscribe(url => {
      const {id} = this.route.snapshot.params;

      this.postService.getPostById(id)
      .subscribe(data => {
        this.post = data;
      });
    })
  }

  openModalReport() {
    this.modalService.show(ReportModalComponent)
  }
}
