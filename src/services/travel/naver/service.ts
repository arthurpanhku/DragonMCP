import { NaverPOI } from './types.js';

export class NaverMapService {
    /**
     * Search for places (Mock)
     */
    static async searchPlace(keyword: string): Promise<NaverPOI[]> {
        console.log('[NaverMap] Searching place:', keyword);

        // Mock data
        return [
            {
                title: `Mock ${keyword}`,
                category: 'Restaurant',
                address: 'Seoul, Gangnam-gu',
                roadAddress: 'Teheran-ro 123',
                mapx: '123456',
                mapy: '654321',
            },
        ];
    }
}
