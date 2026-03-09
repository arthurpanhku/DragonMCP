export interface AmapPOI {
    id: string;
    name: string;
    type: string;
    typecode: string;
    biz_type: string;
    address: string;
    location: string;
    tel: string;
    distance?: string;
}

export interface AmapPOIResponse {
    status: string;
    info: string;
    infocode: string;
    count: string;
    pois: AmapPOI[];
}

export interface AmapWalkingRouteResponse {
    status: string;
    info: string;
    infocode: string;
    route: {
        origin: string;
        destination: string;
        paths: {
            distance: string;
            duration: string;
            steps: {
                instruction: string;
                orientation: string;
                road: string;
                distance: string;
                duration: string;
                polyline: string;
                action: string;
                assistant_action: string;
            }[];
        }[];
    };
}

export interface AmapDrivingRouteResponse {
    status: string;
    info: string;
    infocode: string;
    route: {
        origin: string;
        destination: string;
        paths: {
            distance: string;
            duration: string;
            strategy: string;
            steps: {
                instruction: string;
                orientation: string;
                road: string;
                distance: string;
                duration: string;
                polyline: string;
                action: string;
                assistant_action: string;
            }[];
        }[];
    };
}

export interface AmapTransitRouteResponse {
    status: string;
    info: string;
    infocode: string;
    route: {
        origin: string;
        destination: string;
        distance: string;
        taxi_cost: string;
        transits: {
            cost: string;
            duration: string;
            nightflag: string;
            walking_distance: string;
            segments: {
                taxi: any;
                walking: {
                    origin: string;
                    destination: string;
                    distance: string;
                    duration: string;
                    steps: any[];
                };
                bus: {
                    buslines: {
                        departure_stop: { name: string; location: string };
                        arrival_stop: { name: string; location: string };
                        name: string;
                        id: string;
                        type: string;
                        distance: string;
                        duration: string;
                        polyline: string;
                        via_num: string;
                        via_stops: any[];
                    }[];
                };
                railway: {
                    id: string;
                    name: string;
                    trip: string;
                    departure_stop: { name: string; location: string; time: string };
                    arrival_stop: { name: string; location: string; time: string };
                    distance: string;
                    type: string;
                    time: string;
                };
            }[];
        }[];
    };
}
