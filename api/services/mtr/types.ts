export interface MTRStation {
    code: string;
    name: {
        en: string;
        zh: string;
    };
}

export interface MTRLine {
    code: string;
    name: {
        en: string;
        zh: string;
    };
    stations: string[]; // Ordered list of station codes
    upDest: string; // Destination for UP direction
    downDest: string; // Destination for DOWN direction
}

export interface MTRScheduleResponse {
    status: number;
    message: string;
    sys_time: string;
    curr_time: string;
    isdelay: string;
    data: Record<string, {
        curr_time: string;
        sys_time: string;
        UP?: MTRTrainInfo[];
        DOWN?: MTRTrainInfo[];
    }>;
}

export interface MTRTrainInfo {
    ttnt: string; // Time to next train (minutes)
    valid: string;
    plat: string;
    time: string;
    source: string;
    dest: string;
    seq: string;
}
