import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { vnpayConfig } from 'src/config';
import * as qs from 'qs'
import * as moment from 'moment';
import { HmacSHA512, enc } from 'crypto-js';


import { Buffer } from 'buffer';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  ipAddress = ''

  constructor(private http: HttpClient) {
    
  }

  generatePaymentForm(paymentData: any): string {
    let date = new Date();
    let createDate = moment(date).format('YYYYMMDDHHmmss');
    let ipAddr = '';

    this.getCurrentIpAddress().subscribe(
      data => {
        ipAddr = data.ip;
      }
    );
    
    let tmnCode = vnpayConfig.tmnCode;
    let secretKey = vnpayConfig.secretKey;
    let vnpUrl = vnpayConfig.vnpUrl;
    let returnUrl = vnpayConfig.returnUrl;
    let orderId = moment(date).format('DDHHmmss');
    let amount = paymentData.amount;
    let bankCode = paymentData.bankCode;
    
    let locale = paymentData.language;
    if(locale === null || locale === ''){
        locale = 'vn';
    }

    let currCode = 'VND';
    let vnp_Params : { [key: string]: any }  = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = '42.113.61.177';
    vnp_Params['vnp_CreateDate'] = createDate;
    if(bankCode !== null && bankCode !== ''){
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = this.sortObject(vnp_Params);

    let querystring = qs
    let signData = querystring.stringify(vnp_Params, { encode: false });
    const encodedData = enc.Utf8.parse(signData);

    const hmac = HmacSHA512(encodedData, secretKey);
    const signed = hmac.toString(enc.Hex);

    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
    return vnpUrl;
  }

  

  getCurrentIpAddress() {
    return this.http.get<any>('https://api.ipify.org/?format=json');
  }



  sortObject(obj: any) {
    let sorted:{ [key: string]: any } = {};
    let str = [];
    let key;
    for (key in obj){
      if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
      }
    }
    str.sort();
      for (key = 0; key < str.length; key++) {
          sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
      }
      return sorted;
  }
}
