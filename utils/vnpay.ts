import crypto from 'crypto';
import { format } from 'date-fns';

export function createVNPayUrl({
  amount,
  orderId,
  orderInfo,
  ipAddr,
  returnUrl,
  tmnCode,
  hashSecret,
  vnpUrl,
}: {
  amount: number;
  orderId: string;
  orderInfo: string;
  ipAddr: string;
  returnUrl: string;
  tmnCode: string;
  hashSecret: string;
  vnpUrl: string;
}) {
  const date = new Date();
  const createDate = format(date, 'yyyyMMddHHmmss');

  let vnp_Params: any = {};
  vnp_Params['vnp_Version'] = '2.1.0';
  vnp_Params['vnp_Command'] = 'pay';
  vnp_Params['vnp_TmnCode'] = tmnCode;
  vnp_Params['vnp_Locale'] = 'vn';
  vnp_Params['vnp_CurrCode'] = 'VND';
  vnp_Params['vnp_TxnRef'] = orderId;
  vnp_Params['vnp_OrderInfo'] = orderInfo;
  vnp_Params['vnp_OrderType'] = 'other';
  vnp_Params['vnp_Amount'] = amount * 100; // VNPay uses cents
  vnp_Params['vnp_ReturnUrl'] = returnUrl;
  vnp_Params['vnp_IpAddr'] = ipAddr;
  vnp_Params['vnp_CreateDate'] = createDate;

  // Sort params
  vnp_Params = Object.keys(vnp_Params)
    .sort()
    .reduce((obj: any, key) => {
      obj[key] = vnp_Params[key];
      return obj;
    }, {});

  const signData = new URLSearchParams(vnp_Params).toString();
  const hmac = crypto.createHmac('sha512', hashSecret);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
  
  vnp_Params['vnp_SecureHash'] = signed;

  const finalUrl = vnpUrl + '?' + new URLSearchParams(vnp_Params).toString();
  return finalUrl;
}

export function verifyVNPayResponse(params: any, hashSecret: string) {
  const vnp_SecureHash = params['vnp_SecureHash'];
  delete params['vnp_SecureHash'];
  delete params['vnp_SecureHashType'];

  const sortedParams = Object.keys(params)
    .sort()
    .reduce((obj: any, key) => {
      obj[key] = params[key];
      return obj;
    }, {});

  const signData = new URLSearchParams(sortedParams).toString();
  const hmac = crypto.createHmac('sha512', hashSecret);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

  return vnp_SecureHash === signed;
}
