export interface AlipayOrder {
    outTradeNo: string;
    totalAmount: string;
    subject: string;
    productCode: string;
}

export interface AlipayResponse {
    code: string;
    msg: string;
    outTradeNo: string;
    qrCode?: string; // For QR payment
}
