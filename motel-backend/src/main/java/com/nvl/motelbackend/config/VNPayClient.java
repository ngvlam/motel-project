package com.nvl.motelbackend.config;

import org.apache.commons.codec.digest.HmacUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import javax.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Component
public class VNPayClient {
    private String vnPaySecretKey = "OPYZCTAARJHQJYOAFFICVZONYGBHOISD";

    public boolean validateSignature(Map<String, String> params) throws UnsupportedEncodingException {
        String vnp_SecureHash = params.get("vnp_SecureHash");
        String inputHash = getHash(params);
        System.out.println(vnp_SecureHash);
        System.out.println(inputHash);
        return vnp_SecureHash.equals(inputHash);
    }

    private String getHash(Map<String, String> params) throws UnsupportedEncodingException {
        params.remove("vnp_SecureHash");
        params.remove("vnp_SecureHashType");
        StringBuilder hashData = new StringBuilder();
        List<String> fieldNames = new ArrayList<>(params.keySet());
        Collections.sort(fieldNames);

        Iterator itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = (String) itr.next();
            String fieldValue = (String) params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                //Build hash data
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
//                hashData.append(fieldValue);
                if (itr.hasNext()) {
                    hashData.append('&');
                }
            }
        }

        String vnp_SecureHash = hmacSHA512(vnPaySecretKey, hashData.toString());
//        hashData.setLength(hashData.length() - 1);
//        hashData.append(vnPaySecretKey);

        return vnp_SecureHash;
    }

    public String hmacSHA512(String key, String data) {
//        try {
//
//            if (key == null || data == null) {
//                throw new NullPointerException();
//            }
//            final Mac hmac512 = Mac.getInstance("HmacSHA512");
//            byte[] hmacKeyBytes = key.getBytes();
//            final SecretKeySpec secretKey = new SecretKeySpec(hmacKeyBytes, "HmacSHA512");
//            hmac512.init(secretKey);
//            byte[] dataBytes = data.getBytes(StandardCharsets.UTF_8);
//            byte[] result = hmac512.doFinal(dataBytes);
//            StringBuilder sb = new StringBuilder(2 * result.length);
//            for (byte b : result) {
//                sb.append(String.format("%02x", b & 0xff));
//            }
//            return sb.toString();
//
//        } catch (Exception ex) {
//            return "";
//        }
        String hmac = new HmacUtils("HmacSHA512", key).hmacHex(data);
        return hmac;
    }

    public Map<String, String> getParamsFromRequest(HttpServletRequest request) {
        Map<String, String> vnp_Params = new HashMap<>();
        Enumeration<String> paramNames = request.getParameterNames();
        while (paramNames.hasMoreElements()) {
            String paramName = paramNames.nextElement();
            String paramValue = request.getParameter(paramName);
            if (paramValue != null && paramValue.length() > 0) {
                vnp_Params.put(paramName, paramValue);
            }
        }
        return vnp_Params;
    }
}
