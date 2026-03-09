import { AlipayOrder, AlipayResponse } from './types.js';

export class AlipayService {
    /**
     * Create a payment order (Mock)
     */
    static async createOrder(order: Partial<AlipayOrder>): Promise<AlipayResponse> {
        console.log('[Alipay] Creating order:', order);

        return {
            code: '10000',
            msg: 'Success',
            outTradeNo: order.outTradeNo || 'mock_trade_no',
            qrCode: 'https://qr.alipay.com/mock_qr_code',
        };
    }

    /**
     * Query order status (Mock)
     */
    static async queryOrder(outTradeNo: string): Promise<any> {
        console.log('[Alipay] Querying order:', outTradeNo);
        return {
            tradeStatus: 'TRADE_SUCCESS',
        };
    }
}
