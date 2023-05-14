import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Page } from 'src/app/model/page';
import { Post } from 'src/app/model/post';
import { AuthService } from 'src/app/services/auth.service';
import { ConfirmationModalService } from 'src/app/services/confirmation-modal.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-my-post-list',
  templateUrl: './my-post-list.component.html',
  styleUrls: ['./my-post-list.component.css']
})
export class MyPostListComponent implements OnInit{
  posts: Post[] = []
  page: Page<any> = new Page<any>
  loading = false;

  constructor(private postService: PostService,
    private confirmationModalService: ConfirmationModalService,
    private toastr: ToastrService,
    private authService: AuthService) {

  }
  ngOnInit(): void {
    this.getMyPosts(1)
  }


  getMyPosts(pageNumber: number) {
    this.loading= true;
    this.postService.getPostByUser(this.authService.getUserId(), pageNumber - 1).subscribe({
      next: data => {
        this.page = data;
        this.posts = data.content;
        this.loading = false
      },
      error: error => {
        console.log(error)
        this.loading = false
      }
    })
  }

  openModalConfirmHide(postTitle: string, id: number) {
    this.confirmationModalService.openModal('Xác nhận', `Bạn chắc chắn muốn ẩn tin ?
    "${postTitle}"`)
      .subscribe(result => {
        if (result.confirmed) {
          this.postService.hidePost(id).subscribe({
            next: data => {
              this.toastr.success('Ẩn tin đăng thành công', 'Ẩn tin đăng')
              location.reload()
            },
            error: error => {
              this.toastr.error('Có lỗi trong quả trình ẩn tin' + error, 'Ẩn tin đăng')
            }
          })
        }
      });
  }
}

