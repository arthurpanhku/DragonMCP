import { GrabRideRequest, GrabRideEstimate } from './types.js';

export class GrabService {
    /**
     * Estimate ride price (Mock)
     */
    static async estimateRide(request: GrabRideRequest): Promise<GrabRideEstimate> {
        console.log('[Grab] Estimating ride:', request);

        // Mock logic
        return {
            price: 15.50,
            currency: 'SGD',
            estimatedTime: 12,
        };
    }

    /**
     * Book a ride (Mock)
     */
    static async bookRide(request: GrabRideRequest): Promise<string> {
        console.log('[Grab] Booking ride:', request);
        return 'grab_booking_sg_12345';
    }
}
