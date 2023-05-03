import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentService } from 'src/app/services/payment.service';
import { vnpayConfig } from 'src/config';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit{
  paymentForm!: string;

  constructor(private paymentService: PaymentService, private router: Router) {}
  ngOnInit(): void {
    const paymentData = {
      amount: '100000',
      bankCode: '',
      language: '',
    };
  
    window.open(this.paymentService.generatePaymentForm(paymentData), "_blank")
    // console.log(this.paymentService.generatePaymentForm(paymentData))
  }
  
}
