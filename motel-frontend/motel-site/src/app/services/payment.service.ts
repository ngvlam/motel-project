import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { vnpayConfig } from 'src/config';
import * as qs from 'qs'
import { hashSync } from 'bcryptjs';

import * as moment from 'moment';
import { HmacSHA512, enc, AES } from 'crypto-js';
import * as CryptoJS from 'crypto-js';


import { Buffer } from 'buffer';
import { Payment } from '../model/payment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  ipAddress = ''

  private apiUrl = '/api';

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
    
    let paymentNew = new Payment()
    paymentNew.orderId = orderId;
    paymentNew.amount = amount
    paymentNew.status = "0";
    paymentNew.createdAt = date;

    let salt = CryptoJS.lib.WordArray.random(16);
 
    let encryptedKey = CryptoJS.AES.encrypt(secretKey, '6D7950617373776F7264', {iv: salt}).toString();
    
    this.addPayment(paymentNew, encryptedKey, salt.toString()).subscribe();
      

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

  //LẤY KẾT QUẢ THANH TOÁN
  async getPaymentResult(result: any) : Promise<string>{
    let vnp_Params = {... result}
    let secureHash = vnp_Params.vnp_SecureHash;
    console.log(vnp_Params)
    let orderId = vnp_Params.vnp_TxnRef;
    let rspCode = vnp_Params.vnp_ResponseCode;


    delete vnp_Params.vnp_SecureHash;
    delete vnp_Params.vnp_SecureHashType;

    vnp_Params = this.sortObject(vnp_Params)

    let secretKey = vnpayConfig.secretKey;

    let querystring = qs
    let signData = querystring.stringify(vnp_Params, { encode: false });
    const encodedData = enc.Utf8.parse(signData);


    const hmac = HmacSHA512(encodedData, secretKey);
    const signed = hmac.toString(enc.Hex);


    let payment: Payment | undefined
    let paymentStatus: string | undefined;
    
    try {
      payment = await this.getPaymentByOrderId(orderId).toPromise();
      paymentStatus = payment?.status;
    } catch (error) {
      console.error(error);
    }

    let checkOrderId = true;
    if(payment == null) {
      checkOrderId = false;
    } // Mã đơn hàng "giá trị của vnp_TxnRef" VNPAY phản hồi tồn tại trong CSDL của bạn
    let checkAmount = true; // Kiểm tra số tiền "giá trị của vnp_Amout/100" trùng khớp với số tiền của đơn hàng trong CSDL của bạn

    if(secureHash === signed){ //kiểm tra checksum
      if(checkOrderId){
          if(checkAmount){
              if(paymentStatus=="0"){ //kiểm tra tình trạng giao dịch trước khi cập nhật tình trạng thanh toán
                  if(rspCode=="00"){
                      await this.updatePayment(result).subscribe()
                      
                      return 'Thanh toán thành công'
                  }
                  else {
                      //that bai
                      //paymentStatus = '2'
                      // Ở đây cập nhật trạng thái giao dịch thanh toán thất bại vào CSDL của bạn'
                      await this.updatePayment(result).subscribe()
                      return 'Thanh toán thất bại'
                  }
              }
              else{
                  return 'Đơn hàng này đã được cập nhật trạng thái thanh toán'
              }
          }
          else{
              return 'Tiền nạp không đúng'
          }
      }       
      else {
          return 'Không tìm thấy đơn hàng'
      }
    }
    else {
        return 'Checksum failed'
    }
  }

  getCurrentIpAddress() {
    return this.http.get<any>('https://api.ipify.org/?format=json');
  }

  addTransaction() {

  }

  getPaymentByOrderId(orderId: string) : Observable<Payment>{
    return this.http.get<Payment>(`${this.apiUrl}/payments/${orderId}`)
  }

  addPayment(payment: Payment, encryptedKey: string, hashedSalt: string) : Observable<Payment> {
    return this.http.post<Payment>(`${this.apiUrl}/payments?encryptedKey=${encryptedKey}&hashedSalt=${hashedSalt}`, payment)
  }

  // updatePayment(orderId: string, status: string, amount:number) : Observable<Payment> {
  //   return this.http.put<Payment>(`${this.apiUrl}/payments/${orderId}/status/${status}?amount=${amount}`, null)

  // }

  
  updatePayment(result: any) : Observable<Payment> {
    let params = new HttpParams();

    for (const key in result) {
      if (result.hasOwnProperty(key)) {
        params = params.append(key, result[key]);
      }
    }
    return this.http.put<Payment>(`${this.apiUrl}/payments/vnpay/response?${params.toString()}`, null)

  } 

  getPaymentByUserId(userId: number) : Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/users/${userId}/payments`)
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
