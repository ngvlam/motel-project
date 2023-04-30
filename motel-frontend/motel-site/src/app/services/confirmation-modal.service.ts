import { Injectable } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { ConfirmationModalComponent } from '../components/confirmation-modal-common/modal.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationModalService {

  constructor(private modalService: BsModalService) { }

  openModal(title: string, message: string): Observable<{ confirmed: boolean }> {
    const bsModalRef: BsModalRef = this.modalService.show(ConfirmationModalComponent);
    bsModalRef.content.title = title;
    bsModalRef.content.message = message;
    return bsModalRef.content.onClose;
  }

}
