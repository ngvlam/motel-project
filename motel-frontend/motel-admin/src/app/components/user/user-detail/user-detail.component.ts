import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalConfig, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs';
import { defaultAvatar } from 'src/app/config';
import { Action } from 'src/app/model/action';
import { Page } from 'src/app/model/page';
import { User } from 'src/app/model/user';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';
import { ConfirmationModalComponent } from '../../confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit{
  active = 1;
  user: User = new User();

  actions: Action[] = [];

  // ACTION_COLOR = {
  //   APPROVE: 'green',
  //   CREATE: 'blue',
  //   BLOCK: 'red'
  // };

  ROLE_NAME = {
    ROLE_USER: 'Khách hàng',
    ROLE_ADMIN: 'Quản trị viên',
    ROLE_MODERATOR: 'Kiểm duyệt viên'
  };

  // @ViewChild('more')
  // pendingTemp!: TemplateRef<any>;

  pending: any;

  currentPage = 0;

  canBlock = false;

  role = 'ROLE_USER';

  avatar: any = defaultAvatar;

  id!: number ;

  constructor(private userService: UserService,
    private modalService: NgbModal,
    private modalConfig: NgbModalConfig,
    private postService: PostService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private _sanitizer: DomSanitizer) {
    this.modalConfig.backdrop = 'static';
    this.modalConfig.keyboard = false;
    //   this.tokenService.get().subscribe((token: NbAuthOAuth2JWTToken) => {
    //   this.canBlock = (token.getAccessTokenPayload()['account'].id != this.route.snapshot.params.id);
    // });
    }
  ngOnInit(): void {
    this.route.url.subscribe(url => {
      this.id = this.route.snapshot.params['id'];
      this.userService.getAccountById(this.id)
        .subscribe(data => {
          this.user = data;
          this.role = (this.user.roles.length <= 0) ? 'ROLE_USER' : this.user.roles[0];
          this.userService.getAvatar(this.id)
            .subscribe(avatar => {
              if (avatar.data != null && avatar.data != '')
                this.avatar = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64, ' + avatar.data);
              else
                this.avatar = defaultAvatar;
            });
        });
      this.loadAction(this.id);
    })
  }

  isActionLast = false;

  loadAction(id: number) {
    this.postService.getActionsByUserId(this.currentPage, id)
      .pipe(tap((value: any) => {
        if (value.last) this.isActionLast = true;
        else {
          this.currentPage++;
        }
      }))
      .subscribe((value: Page<Action>) => {
        this.actions.push(...value.content);
      });
  }

  openConfirmationModal(block:boolean) {
    const modalRef = this.modalService.open(ConfirmationModalComponent);
    if(block) {
      modalRef.componentInstance.message = `Bạn chắc chắn muốn mở khóa tài khoản ${this.user.email}`;
    }
    else {
      modalRef.componentInstance.message = `Bạn chắc chắn muốn khóa tài khoản ${this.user.email}`;
    }
     modalRef.result.then((result) => {
      if (result === 'confirm') {
         this.blockAccount(block)
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }

  blockAccount(block: boolean) {
    if (!block)
      this.userService.blockAccount(this.user.id).subscribe(value => {
        this.toastr.success(`Tài khoản ${this.user.email} đã bị khóa`, 'Khóa tài khoản');
        this.user = value
      });
    else
      this.userService.unBlockAccount(this.user.id).subscribe(value => {
        this.toastr.success(`Tài khoản ${this.user.email} đã được mở khóa`, 'Mở khóa tài khoản');
        this.user = value
      });
  }

  fomatDateTime(dt: number[] | number) {
    if(Array.isArray(dt))
    return `${dt[3]}:${dt[4]} ${dt[2]}/${dt[1]}/${dt[0]}`;
    else
    return dt
  }
}
