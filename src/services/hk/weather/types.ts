export interface HKWeatherResponse {
    temperature: {
        data: {
            place: string;
            value: number;
            unit: string;
        }[];
    };
    humidity: {
        data: {
            place: string;
            value: number;
            unit: string;
        }[];
    };
    rainfall: {
        data: {
            unit: string;
            place: string;
            max: number;
            main: string;
        }[];
    };
    uvindex?: {
        data: {
            place: string;
            value: number;
            desc: string;
        }[];
    };
    updateTime: string;
    warningMessage?: string[];
    icon?: number[];
}
