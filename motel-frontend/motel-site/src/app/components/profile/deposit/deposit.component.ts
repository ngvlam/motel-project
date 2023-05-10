import { Component, OnInit } from '@angular/core';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css']
})
export class DepositComponent implements OnInit{
  amount: number = 0;
message: string = '';
  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    
  }

  openDepositPage() {
    const paymentData = {
      amount: this.amount,
      bankCode: '',
      language: '',
    };

    if(this.amount < 10000) {
      this.message = "Vui lòng nạp tối thiểu 10.000đ"
    }
    else {
      let url = this.paymentService.generatePaymentForm(paymentData)

      window.open(url, "_blank")
    }
  }
}
