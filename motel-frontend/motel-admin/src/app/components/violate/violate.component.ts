import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Page } from 'src/app/model/page';
import { ReportPost } from 'src/app/model/report-post';
import { ReportPostService } from 'src/app/services/report-post.service';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-violate',
  templateUrl: './violate.component.html',
  styleUrls: ['./violate.component.css']
})
export class ViolateComponent implements OnInit{

  constructor(private reportPostService: ReportPostService,
    private toastr: ToastrService,
    private modalService: NgbModal) {
    this.page.content = [];
    this.page.totalElements = 0;
    this.page.size = 5;
    this.page.totalPages = 0;
    this.page.sort = ''
  }

 
  page: Page<any> = new Page<any>();
  reportPosts: ReportPost[] = []
  reportText: string = ''

  reportList = [
    {key: 'scam', label: 'Lừa đảo', checked: false},
    {key: 'duplicate', label: 'Trùng lặp', checked: false},
    {key: 'cannotContact', label: 'Không liên lạc được', checked: false},
    {key: 'wrongPhoto', label: 'Ảnh', checked: false},
    {key: 'wrongInfo', label: 'Thông tin sai lệch', checked: false},
    {key: 'rentedOut', label: 'Đã cho thuê', checked: false} 
  ]

  ngOnInit(): void {
    this.loadReportPost(1)

  }

  loadReportPost(pageNumber: number) {
    this.reportPostService.getAllReport(pageNumber-1, this.page.size).subscribe({
      next: data => {
        this.page = data;
        this.reportPosts = this.page.content;

        for (const item of this.reportPosts) {
          item.checked = false;
        }
      }
    })
  }

  allChecked = false;

  updateAllChecked(): void {
    if (this.allChecked) {
      this.reportPosts = this.reportPosts.map(item => {
        return {
          ...item,
          checked: true
        };
      });
    } else {
      this.reportPosts = this.reportPosts.map(item => {
        return {
          ...item,
          checked: false
        };
      });
    }
  }

  updateSingleChecked(): void {
    if (this.reportPosts.every(item => item.checked === false)) {
      this.allChecked = false;
    } else if (this.reportPosts.every(item => item.checked === true)) {
      this.allChecked = true;
    }
  }


  anyChecked() {
    return this.reportPosts.some(report => report.checked);
  }

  updatePageSize(pageSize: string) {
    this.page.size = Number(pageSize);
    this.page.number = 1;
    this.loadReportPost(1);
  }

  deleteReport() {
    let reportListIds = this.reportPosts.filter(item => item.checked).map(item => item.id)
    const modalRef = this.modalService.open(ConfirmationModalComponent);
    modalRef.componentInstance.message = `Bạn chắc chắn muốn xóa báo cáo ${reportListIds.join(', ')}`;
    
    modalRef.result.then((result) => {
      if(result == 'confirm') {
        this.reportPostService.removeReports(reportListIds).subscribe({
          next: data => {
            this.toastr.success("Xóa báo cáo thành công", "Xóa báo cáo")
            this.loadReportPost(this.page.number)
          }, 
          error: error => {
            
          }
        })
      }
    })
  }
}
