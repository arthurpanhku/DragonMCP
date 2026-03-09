import { Restaurant, MenuItem } from './types.js';

export class MeituanService {
    /**
     * Search for nearby restaurants (Mock)
     */
    static async searchRestaurants(keyword: string, location: string): Promise<Restaurant[]> {
        console.log(`[Meituan] Searching for "${keyword}" near ${location}`);

        // Mock data
        return [
            {
                id: 'mt_001',
                name: 'KFC (Tech Park Branch)',
                rating: 4.8,
                deliveryTime: 30,
                minOrder: 20,
                deliveryFee: 5,
            },
            {
                id: 'mt_002',
                name: 'Local Noodle Shop',
                rating: 4.5,
                deliveryTime: 25,
                minOrder: 15,
                deliveryFee: 3,
            },
        ];
    }

    /**
     * Get restaurant menu (Mock)
     */
    static async getMenu(restaurantId: string): Promise<MenuItem[]> {
        console.log(`[Meituan] Getting menu for ${restaurantId}`);
        return [
            { id: 'm_01', name: 'Combo A', price: 35 },
            { id: 'm_02', name: 'Combo B', price: 42 },
        ];
    }
}
