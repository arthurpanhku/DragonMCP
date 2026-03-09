import { LinePayOrder, LinePayResponse } from './types.js';

export class LinePayService {
    /**
     * Request payment (Mock)
     */
    static async requestPayment(order: LinePayOrder): Promise<LinePayResponse> {
        console.log('[LinePay] Requesting payment:', order);

        return {
            returnCode: '0000',
            returnMessage: 'Success',
            info: {
                paymentUrl: {
                    web: 'https://sandbox-web-pay.line.me/web/payment/url',
                    app: 'line://pay/payment/url',
                },
                transactionId: '202101011234567890',
            },
        };
    }
}
