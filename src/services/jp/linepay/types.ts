export interface LinePayOrder {
    amount: number;
    currency: string;
    productName: string;
    orderId: string;
}

export interface LinePayResponse {
    returnCode: string;
    returnMessage: string;
    info: {
        paymentUrl: {
            web: string;
            app: string;
        };
        transactionId: string;
    };
}
