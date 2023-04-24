import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { defaultAvatar } from 'src/app/config';
import { Post } from 'src/app/model/post';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit{
  
  avatar: any = defaultAvatar;
  post = new Post();
  disableBtnAction = false;

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
    private toastr: ToastrService,
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
      this.marker.position = this.center;
    })
  }

  // blockPost() {
  //   this.disableBtnAction = true;
  //   this.postService.blockPostById(this.post.id)
  //     .subscribe((value: Post) => {
  //       this.notification.success('Khóa bài', `Bài viết "${value.title}" đã được khóa.`);
  //       this.router.navigateByUrl('/posts?tab=1');
  //     }, error => {
  //       this.disableBtnAction = false;
  //     });
  // }

  approvePost() {
    this.disableBtnAction = true;
    this.postService.approvePostById(this.post.id)
      .subscribe( {
        next: 
        data => {
          this.toastr.success(`Bài viết "${data.title}" đã được kiểm duyệt.`,'Duyệt bài' , {
            timeOut: 3000,
          });
          this.router.navigateByUrl('/posts');
        }, 
      
        error: err => {
          this.disableBtnAction = false;
          console.log(err)
        }
      });
  }

  blockPost() {
    this.disableBtnAction = true;
    this.postService.blockPostById(this.post.id)
      .subscribe( {
        next: 
        data => {
          this.toastr.success(`Bài viết "${data.title}" đã bị từ chối.`,'Duyệt bài' , {
            timeOut: 3000,
          });
          this.router.navigateByUrl('/posts');
        }, 
      
        error: err => {
          this.disableBtnAction = false;
          console.log(err)
        }
      });
  }

}
