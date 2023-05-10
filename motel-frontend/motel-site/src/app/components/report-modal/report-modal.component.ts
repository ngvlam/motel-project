import { Component, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ReportPost } from 'src/app/model/report-post';
import { ReportPostService } from 'src/app/services/report-post.service';

interface selectedReport {
  [key: string]: boolean;
}

@Component({
  selector: 'app-report-modal',
  templateUrl: './report-modal.component.html',
  styleUrls: ['./report-modal.component.css']
})
export class ReportModalComponent {
  postId!: number;

  checkboxValue: string = ''
  textReport: string = ''


   reportList = [
    {key: 'scam', label: 'Lừa đảo', checked: false},
    {key: 'duplicate', label: 'Trùng lặp', checked: false},
    {key: 'cannotContact', label: 'Không liên lạc được', checked: false},
    {key: 'wrongPhoto', label: 'Ảnh', checked: false},
    {key: 'wrongInfo', label: 'Thông tin sai lệch', checked: false},
    {key: 'rentedOut', label: 'Đã cho thuê', checked: false} 
  ]

  constructor(public bsModalRef: BsModalRef,
    private reportPostService: ReportPostService,
    private toastr: ToastrService) {

  }
 
  ngOnInit() {
    
  }


  submit() {
    this.bsModalRef.hide()
    
    let reportPost = new ReportPost();
    reportPost.postId = this.postId;
    
    for (const item of this.reportList) {
      if (item.checked) {
        reportPost[item.key] = true
      }
      else reportPost[item.key] = false
    }
    
    reportPost.another = this.textReport;

    this.reportPostService.addReportPost(reportPost).subscribe({
      next: data => {
        this.toastr.success("Gửi báo cáo tin đăng thành công")
      },
      error: error => {
        this.toastr.error("Gửi báo cáo tin đăng thất bại")

      }
    })
  }
}
