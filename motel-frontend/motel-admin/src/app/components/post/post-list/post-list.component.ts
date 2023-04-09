import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Page } from 'src/app/model/page';
import { Post } from 'src/app/model/post';
import { PostService } from 'src/app/services/post.service';
import { ConfirmationModalComponent } from '../../confirmation-modal/confirmation-modal.component';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit{
  
  @Input('filterBy') filterBy: any = '*';

  @Output('loadComplete') loadDataComplete = new EventEmitter<boolean>();
  
  page: Page<any> = new Page<any>();

  loading = false;

  posts: Post[] = [];

  userId: number = 1;

  getData = this.postService.getAllPosts;

  constructor(private postService: PostService, private modalService: NgbModal, private modalConfig: NgbModalConfig) {
    this.modalConfig.backdrop = false ;
    this.modalConfig.keyboard = false;
  }

  ngOnInit(): void {
    switch (this.filterBy) {
      case 'WAITING':
        this.getData = this.postService.getWaitingPosts;
        break;
      case 'APPROVED':
        this.getData = this.postService.getApprovedPosts;
        break;
      case 'BLOCKED':
        this.getData = this.postService.getBlockedPosts;
        break;
      case '*':
        this.getData = this.postService.getAllPosts;
        break;
      default:
        this.userId = +this.filterBy;
        this.getData = this.loadDataFilterUserId;
    }
    this.page.totalElements = 0;
    this.page.number = 0;
    this.loadData(1);
  }

  loadData(page: number) {
    this.loading = true;
    this.getData(page - 1)
      .subscribe({
        next: data => {
          this.posts = data.content;
          this.loadDataComplete.emit((page == 1 && this.posts.length > 0) || page > 1);
          data.content = [];
          this.page = data;
          this.page.number+=1
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }


  loadDataFilterUserId(page: number) {
    return this.postService.getPostOfUser(this.userId, page);
  }


  openConfirmationApproveModal() {
    const modalRef = this.modalService.open(ConfirmationModalComponent);
    modalRef.componentInstance.message = 'Bạn chắc chắn muốn duyệt bài viết này ngay';
    modalRef.result.then((result) => {
      if (result === 'confirm') {
        // handle confirmation logic
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  openConfirmationRejectModal() {
    const modalRef = this.modalService.open(ConfirmationModalComponent);
    modalRef.componentInstance.message = 'Bạn chắc chắn muốn từ chối bài viết này ngay';
    modalRef.result.then((result) => {
      if (result === 'confirm') {
        // handle confirmation logic
      }
    }).catch((error) => {
      console.log(error);
    });
  }
  

}
