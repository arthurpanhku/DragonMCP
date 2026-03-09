export interface WeChatPayOrder {
    appId: string;
    mchId: string;
    nonceStr: string;
    sign: string;
    body: string;
    outTradeNo: string;
    totalFee: number;
    spbillCreateIp: string;
    notifyUrl: string;
    tradeType: 'JSAPI' | 'NATIVE' | 'APP' | 'MWEB';
}

export interface WeChatPayResponse {
    return_code: string;
    return_msg: string;
    // ... other fields
}
