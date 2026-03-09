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
