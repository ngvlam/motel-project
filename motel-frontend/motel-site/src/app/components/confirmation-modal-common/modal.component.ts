import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-confirmation-modal',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">{{ title }}</h4>
      <button type="button" class="close" (click)="cancel()">&times;</button>
    </div>
    <div class="modal-body" [innerText]="message"></div>
    <div class="modal-footer">
      <button type="button" class="btn btn-danger" (click)="confirm()">Có</button>
      <button type="button" class="btn btn-secondary" (click)="cancel()">Hủy</button>
    </div>
  `
})
export class ConfirmationModalComponent {

  title: string = '';
  message: string = '';
  onClose: Subject<{ confirmed: boolean }> = new Subject();

  constructor(public bsModalRef: BsModalRef) { }

  confirm() {
    this.bsModalRef.hide();
    this.bsModalRef.content.onClose.next({ confirmed: true });
  }

  cancel() {
    this.bsModalRef.hide();
  }

}
