import { Product } from './types.js';

export class TaobaoService {
    /**
     * Search for products (Mock)
     */
    static async searchProducts(keyword: string): Promise<Product[]> {
        console.log(`[Taobao] Searching for "${keyword}"`);

        // Mock data
        return [
            {
                id: 'tb_1001',
                title: `Premium ${keyword}`,
                price: 199.00,
                shopName: 'Flagship Store',
                sales: 5000,
                url: 'https://item.taobao.com/item.htm?id=1001',
            },
            {
                id: 'tb_1002',
                title: `Budget ${keyword}`,
                price: 49.90,
                shopName: 'Discount Shop',
                sales: 12000,
                url: 'https://item.taobao.com/item.htm?id=1002',
            },
        ];
    }
}
