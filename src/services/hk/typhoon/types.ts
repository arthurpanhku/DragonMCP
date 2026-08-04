export type TyphoonSignal = null | '1' | '3' | '8NE' | '8SE' | '8SW' | '8NW' | '9' | '10';
export type RainstormSignal = null | 'amber' | 'red' | 'black';

export interface WarningSummaryItem {
    name: string;
    code: string;
    actionCode?: string;
    issueTime?: string;
    updateTime?: string;
    expireTime?: string;
}

export type WarningSummary = Record<string, WarningSummaryItem>;

export interface WarningDetail {
    contents?: string[];
    warningStatementCode: string;
    subtype?: string;
    updateTime?: string;
}

export interface WarningInfo {
    details?: WarningDetail[];
}

export interface ActiveWarning {
    code: string;
    name: string;
    subtype?: string;
    issueTime?: string;
    updateTime?: string;
    details?: string[];
}

export interface HKWarningStatus {
    typhoon: {
        signal: TyphoonSignal;
        issueTime?: string;
        updateTime?: string;
    };
    rainstorm: {
        signal: RainstormSignal;
        issueTime?: string;
        updateTime?: string;
    };
    otherWarnings: ActiveWarning[];
    noSignalsInForce: boolean;
}
