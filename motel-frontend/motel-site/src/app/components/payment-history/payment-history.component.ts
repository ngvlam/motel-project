import { Component, OnInit } from '@angular/core';
import { Payment } from 'src/app/model/payment';
import { AuthService } from 'src/app/services/auth.service';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.css']
})
export class PaymentHistoryComponent implements OnInit{

  payments: Payment[] | undefined
  userId: number | undefined

  constructor(private paymentService: PaymentService, private authService: AuthService) {}

  ngOnInit(): void {
    this.getPaymentsByUser()
  }

  async getPaymentsByUser() {
    try {
      const currentUser = await this.authService.getCurrentUser().toPromise();
      this.userId = currentUser?.id;
  
      const payments = await this.paymentService.getPaymentByUserId(this.userId!).toPromise();
      this.payments = payments;
    } catch (error) {
      console.error(error);
    }
  }
  
}
