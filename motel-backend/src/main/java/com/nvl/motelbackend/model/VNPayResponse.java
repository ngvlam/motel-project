package com.nvl.motelbackend.model;

import lombok.Data;

import java.util.Map;

public class VNPayResponse {
    private String vnp_TransactionNo;
    private String vnp_ResponseCode;
    private String vnp_BankCode;
    private String vnp_TxnRef;
    private String vnp_Amount;
    private String vnp_CreateDate;

    public VNPayResponse(Map<String, String> vnpParams) {
        this.vnp_TransactionNo = vnpParams.get("vnp_TransactionNo");
        this.vnp_ResponseCode = vnpParams.get("vnp_ResponseCode");
        this.vnp_BankCode = vnpParams.get("vnp_BankCode");
        this.vnp_TxnRef = vnpParams.get("vnp_TxnRef");
        this.vnp_Amount = vnpParams.get("vnp_Amount");
        this.vnp_CreateDate = vnpParams.get("vnp_CreateDate");
    }
}
