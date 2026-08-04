export interface MTRStation {
    code: string;
    name: {
        en: string;
        zh: string;
    };
}

/**
 * A spur that leaves the main sequence at `junction`. Modelled separately so a
 * route to LOHAS Park is never described as "towards Po Lam" — those are
 * different trains, and a rider following that advice would never arrive.
 */
export interface MTRBranch {
    junction: string; // Station on the main sequence where the branch splits off
    stations: string[]; // Branch stations, ordered outward from the junction
}

export interface MTRLine {
    code: string;
    name: {
        en: string;
        zh: string;
    };
    stations: string[]; // Ordered list of station codes (main sequence)
    upDest: string; // Destination for UP direction
    downDest: string; // Destination for DOWN direction
    branches?: MTRBranch[];
}

/** One continuous ride on a single line. A journey is a list of these. */
export interface RouteLeg {
    line: string; // Line code
    direction: 'UP' | 'DOWN';
    from: string; // Boarding station code
    to: string; // Alighting station code
    stops: number; // Number of stops travelled
    termini: string[]; // Possible train destinations, for platform signage
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
