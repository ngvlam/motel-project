import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-payment-result',
  templateUrl: './payment-result.component.html',
  styleUrls: ['./payment-result.component.css']
})
export class PaymentResultComponent implements OnInit{
  constructor(private activatedRoute: ActivatedRoute,
    private paymentService: PaymentService) {}
    result = {}
    amount = 0;
    transactionNo = ''
    orderId = ''
    type = ''
    BankCode = ''
    dateString = ''
    datePay = ''
    resultPayment = ''

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.result = params;
      this.amount = params['vnp_Amount']
      this.orderId = params['vnp_TxnRef']
      this.transactionNo = params['vnp_TransactionNo']
      this.type = params['vnp_CardType']
      this.BankCode = params['vnp_BankCode']
      this.dateString = params['vnp_PayDate']

      const year = parseInt(this.dateString.substr(0, 4), 10);
      const month = parseInt(this.dateString.substr(4, 2), 10) - 1; // Month is zero-indexed
      const day = parseInt(this.dateString.substr(6, 2), 10);
      const hour = parseInt(this.dateString.substr(8, 2), 10);
      const minute = parseInt(this.dateString.substr(10, 2), 10);
      const second = parseInt(this.dateString.substr(12, 2), 10);
      const datePay = new Date(year, month, day, hour, minute, second);
      this.datePay = datePay.toLocaleString("vi-VN")

      this.submitPayment()

    })

    if (this.resultPayment == 'Thanh toán thành công')
      console.log('sha')
    
  }

 async submitPayment() {
    
    try {
      this.resultPayment = await this.paymentService.getPaymentResult(this.result);
    } catch (error) {
      console.error(error);
    }
  }
}
