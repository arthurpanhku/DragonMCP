export interface NaverPOI {
    title: string;
    category: string;
    address: string;
    roadAddress: string;
    mapx: string;
    mapy: string;
}

export interface NaverSearchResponse {
    lastBuildDate: string;
    total: number;
    start: number;
    display: number;
    items: NaverPOI[];
}
