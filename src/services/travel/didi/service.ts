import { RideRequest, RideEstimate } from './types.js';

export class DidiService {
    /**
     * Estimate ride price (Mock)
     */
    static async estimatePrice(request: RideRequest): Promise<RideEstimate> {
        console.log('[Didi] Estimating price:', request);

        // Mock logic based on coordinates or random
        return {
            price: 35.5,
            duration: 25,
            distance: 8.2,
        };
    }

    /**
     * Request a ride (Mock)
     */
    static async requestRide(request: RideRequest): Promise<string> {
        console.log('[Didi] Requesting ride:', request);
        return 'ride_order_123456';
    }
}
