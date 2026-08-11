export type TyphoonSignalCode = 'nil' | '1' | '3' | '8NE' | '8SE' | '8NW' | '8SW' | '9' | '10';
export type RainstormSignalCode = 'nil' | 'amber' | 'red' | 'black';

export interface TyphoonSignal {
    code: TyphoonSignalCode;
    description: string;
    issuedTime: string | null;
}

export interface RainstormSignal {
    code: RainstormSignalCode;
    description: string;
    issuedTime: string | null;
}

export interface OtherWarning {
    type: string;
    description: string;
    issuedTime: string | null;
}

export interface TyphoonSignalResponse {
    typhoonSignal: TyphoonSignal;
    rainstormSignal: RainstormSignal;
    otherWarnings: OtherWarning[];
}

export interface HKOWarningInfoResponse {
    tropicalCycloneWarning?: { warningType: string | number; warningDesc: string };
    rainstormWarning?: { warningType: string | number; warningDesc: string };
    thunderstormWarning?: Array<{ warningType: string | number; warningDesc: string }>;
    landslideWarning?: { warningType: string | number; warningDesc: string };
    coldWeatherWarning?: { warningType: string | number; warningDesc: string };
    veryHotWeatherWarning?: { warningType: string | number; warningDesc: string };
    strongMonsoonWarning?: { warningType: string | number; warningDesc: string };
    updateTime?: string;
}
