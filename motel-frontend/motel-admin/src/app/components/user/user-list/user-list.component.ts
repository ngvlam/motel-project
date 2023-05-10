import { Component, OnInit } from '@angular/core';
import { Page } from 'src/app/model/page';
import { UserService } from 'src/app/services/user.service';
import { SortColumn, SortDirection } from 'src/app/directive/sort.directive';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '../../confirmation-modal/confirmation-modal.component';
import { User } from 'src/app/model/user';
import { ToastrService } from 'ngx-toastr';
import { defaultAvatar } from 'src/app/config';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit{

  currentSort:  { column: SortColumn, direction: SortDirection } = { column: '', direction: '' };

  sort: string = '';
  searchText: string = '';

  page: Page<any> = new Page<any>();

  avatar: any = defaultAvatar;

  ROLE_NAME :{ [key: string]: string } = {
    ROLE_USER: 'Khách hàng',
    ROLE_ADMIN: 'Quản trị viên',
    ROLE_MODERATOR: 'Kiểm duyệt viên'
  };

  constructor(private userService: UserService, 
    private modalService: NgbModal, 
    private modalConfig: NgbModalConfig,
    private toastr: ToastrService,
    private _sanitizer: DomSanitizer
    ) {
    this.page.content = [];
    this.page.totalElements = 0;
    this.page.size = 0;
    this.page.totalPages = 0;
    this.page.sort = ''

    this.modalConfig.backdrop = 'static';
    this.modalConfig.keyboard = false;
  }

  loading = false;

  ngOnInit(): void {
    this.loadData(1)
  }

  loadData(pageNumber: number) {
    this.loading = true;
    let filterBy = this.accountOptions.filter(item => item.checked).map(item => item.value);
    let result$: Observable<Page<any>>;

    if(this.searchText == null || this.searchText == '')
      result$ = this.userService.getAllApproverAccounts(pageNumber - 1, this.page.size, this.sort, filterBy)
    else
      result$ = this.userService.getAllApproverSearchAccounts(pageNumber - 1, this.page.size, this.searchText, this.sort, filterBy)
    
    result$.subscribe({
      next: data => {
        this.page = data;
        this.page.number+=1
        this.loading = false;
        // this.page.content.forEach(item => {
        //   if (item.b64 != null && item.b64 != '')
        //       this.avatar = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64, ' + item.b64);
        //     else
        //       this.avatar = defaultAvatar;
        // })
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onSearchTextChange() {
    this.loadData(1)
  }

  onClearButtonClick() {
    this.searchText = '';
    this.loadData(1)
  }

   // filter account
   allChecked = true;
   indeterminate = false;
   accountOptions = [
     { label: 'Khách hàng', value: 'ROLE_USER', checked: true },
     { label: 'Kiểm duyệt viên', value: 'ROLE_MODERATOR', checked: true },
     { label: 'Quản trị viên', value: 'ROLE_ADMIN', checked: true }
   ];

   updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      this.accountOptions = this.accountOptions.map(item => {
        return {
          ...item,
          checked: true
        };
      });
    } else {
      this.accountOptions = this.accountOptions.map(item => {
        return {
          ...item,
          checked: false
        };
      });
    }

    this.loadData(1);
  }

  updateSingleChecked(): void {
    this.loadData(1);
    if (this.accountOptions.every(item => item.checked === false)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.accountOptions.every(item => item.checked === true)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
  }



  updatePageSize(pageSize: string) {
    this.page.size = Number(pageSize);
    this.page.number = 1;
    this.loadData(1);
  }


  onSort({ column, direction }: { column: SortColumn, direction: SortDirection }) {
   // Reset the sorting direction for all columns except the current one
    Object.keys(this.currentSort).forEach(key => {
      if (key !== 'column') { 
        this.currentSort['direction'] = '';
        this.currentSort['column'] = '';
      }
    });

    this.currentSort.column = column;
    this.currentSort.direction = direction;
    this.sort = column.toString() + ',' + direction.toString()
    this.page.sort = this.sort;

    if (direction === '') {
      this.sort = ''
      this.loadData(this.page.number)
      return;
    }

    this.loadData(this.page.number);
  }


   openConfirmationModal(user: User) {
    const modalRef = this.modalService.open(ConfirmationModalComponent);
    if(user.block) {
      modalRef.componentInstance.message = `Bạn chắc chắn muốn mở khóa tài khoản ${user.email}`;
    }
    else {
      modalRef.componentInstance.message = `Bạn chắc chắn muốn khóa tài khoản ${user.email}`;
    }
     modalRef.result.then((result) => {
      if (result === 'confirm') {
         this.blockAccount(user)
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }

  blockAccount(user: User) {
    if (!user.block)
      this.userService.blockAccount(user.id).subscribe(value => {
        this.toastr.success(`Tài khoản ${user.email} đã bị khóa`, 'Khóa tài khoản');
        this.loadData(this.page.number)
      });
    else
      this.userService.unBlockAccount(user.id).subscribe(value => {
        this.toastr.success(`Tài khoản ${user.email} đã được mở khóa`, 'Mở khóa tài khoản');
        this.loadData(this.page.number)
      });
  }

}
