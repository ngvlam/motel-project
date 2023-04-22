import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

interface selectedReport {
  [key: string]: boolean;
}

@Component({
  selector: 'app-report-modal',
  templateUrl: './report-modal.component.html',
  styleUrls: ['./report-modal.component.css']
})
export class ReportModalComponent {
 
  checkboxValue: string = ''
  textReport: string = ''
  reportList: string[] = []

  selectedReport :selectedReport = {}
  constructor(public bsModalRef: BsModalRef) {
    this.reportList = [
      'Lừa đảo',
      'Trùng lặp',
      'Không liên lạc được',
      'Ảnh',
      'Thông tin sai lệch',
      'Đã cho thuê'
    ]
  }
 
  ngOnInit() {
    
  }


  submit() {
    this.bsModalRef.hide()
    console.log(this.selectedReport)
  }
}
