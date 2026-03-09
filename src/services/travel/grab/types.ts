export interface GrabRideRequest {
    pickup: string;
    dropoff: string;
    serviceType: 'JustGrab' | 'GrabCar' | 'GrabHitch';
}

export interface GrabRideEstimate {
    price: number;
    currency: string;
    estimatedTime: number; // mins
}
