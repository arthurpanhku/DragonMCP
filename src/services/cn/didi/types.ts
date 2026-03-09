export interface RideRequest {
    origin: {
        lat: number;
        lng: number;
        address?: string;
    };
    destination: {
        lat: number;
        lng: number;
        address?: string;
    };
    rideType?: 'express' | 'taxi' | 'premier';
}

export interface RideEstimate {
    price: number;
    duration: number; // minutes
    distance: number; // km
}
