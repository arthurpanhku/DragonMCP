export interface Restaurant {
    id: string;
    name: string;
    rating: number;
    deliveryTime: number; // minutes
    minOrder: number;
    deliveryFee: number;
}

export interface MenuItem {
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
}
