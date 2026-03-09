import { WeChatPayOrder, WeChatPayResponse } from './types.js';

export class WeChatPayService {
    /**
     * Create a unified order (Mock)
     */
    static async createOrder(order: Partial<WeChatPayOrder>): Promise<WeChatPayResponse> {
        console.log('[WeChatPay] Creating order:', order);

        // Mock response
        return {
            return_code: 'SUCCESS',
            return_msg: 'OK',
            // Mocking a prepay_id or code_url
        };
    }

    /**
     * Query order status (Mock)
     */
    static async queryOrder(outTradeNo: string): Promise<any> {
        console.log('[WeChatPay] Querying order:', outTradeNo);
        return {
            trade_state: 'SUCCESS',
            trade_state_desc: 'Payment success',
        };
    }
}
