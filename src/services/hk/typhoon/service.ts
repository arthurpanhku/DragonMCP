import axios from 'axios';
import {
    ActiveWarning,
    HKWarningStatus,
    RainstormSignal,
    TyphoonSignal,
    WarningDetail,
    WarningInfo,
    WarningSummary,
    WarningSummaryItem,
} from './types.js';

const HKO_WEATHER_URL = 'https://data.weather.gov.hk/weatherAPI/opendata/weather.php';

const TYPHOON_SIGNALS: Record<string, TyphoonSignal> = {
    TC1: '1',
    TC3: '3',
    TC8NE: '8NE',
    TC8SE: '8SE',
    TC8SW: '8SW',
    TC8NW: '8NW',
    TC9: '9',
    TC10: '10',
};

const RAINSTORM_SIGNALS: Record<string, RainstormSignal> = {
    WRAINA: 'amber',
    WRAINR: 'red',
    WRAINB: 'black',
};

function isCancelled(summary?: WarningSummaryItem, detail?: WarningDetail): boolean {
    return summary?.actionCode === 'CANCEL' || detail?.subtype === 'CANCEL';
}

function activeWarning(
    code: string,
    summary: WarningSummaryItem | undefined,
    detail: WarningDetail | undefined,
): ActiveWarning {
    return {
        code,
        name: summary?.name || code,
        ...(detail?.subtype ? { subtype: detail.subtype } : {}),
        ...(summary?.issueTime ? { issueTime: summary.issueTime } : {}),
        ...(summary?.updateTime || detail?.updateTime
            ? { updateTime: summary?.updateTime || detail?.updateTime }
            : {}),
        ...(detail?.contents?.length ? { details: detail.contents } : {}),
    };
}

export class HKTropicalWarningService {
    static async getWarningStatus(): Promise<HKWarningStatus> {
        try {
            const [summaryResponse, infoResponse] = await Promise.all([
                axios.get<WarningSummary>(HKO_WEATHER_URL, { params: { dataType: 'warnsum', lang: 'en' } }),
                axios.get<WarningInfo>(HKO_WEATHER_URL, { params: { dataType: 'warningInfo', lang: 'en' } }),
            ]);

            const summary = summaryResponse.data || {};
            const details = infoResponse.data?.details || [];
            const detailByCode = new Map(details.map((detail) => [detail.warningStatementCode, detail]));
            const codes = new Set([...Object.keys(summary), ...details.map((detail) => detail.warningStatementCode)]);

            let typhoonSignal: TyphoonSignal = null;
            let typhoonIssueTime: string | undefined;
            let typhoonUpdateTime: string | undefined;
            let rainstormSignal: RainstormSignal = null;
            let rainstormIssueTime: string | undefined;
            let rainstormUpdateTime: string | undefined;
            const otherWarnings: ActiveWarning[] = [];

            for (const code of codes) {
                const summaryItem = summary[code];
                const detail = detailByCode.get(code);
                if (isCancelled(summaryItem, detail)) continue;

                if (code === 'WTCSGNL') {
                    typhoonSignal = TYPHOON_SIGNALS[detail?.subtype || summaryItem?.code || ''] || null;
                    typhoonIssueTime = summaryItem?.issueTime;
                    typhoonUpdateTime = summaryItem?.updateTime || detail?.updateTime;
                } else if (code === 'WRAIN') {
                    rainstormSignal = RAINSTORM_SIGNALS[detail?.subtype || summaryItem?.code || ''] || null;
                    rainstormIssueTime = summaryItem?.issueTime;
                    rainstormUpdateTime = summaryItem?.updateTime || detail?.updateTime;
                } else {
                    otherWarnings.push(activeWarning(code, summaryItem, detail));
                }
            }

            return {
                typhoon: {
                    signal: typhoonSignal,
                    ...(typhoonIssueTime ? { issueTime: typhoonIssueTime } : {}),
                    ...(typhoonUpdateTime ? { updateTime: typhoonUpdateTime } : {}),
                },
                rainstorm: {
                    signal: rainstormSignal,
                    ...(rainstormIssueTime ? { issueTime: rainstormIssueTime } : {}),
                    ...(rainstormUpdateTime ? { updateTime: rainstormUpdateTime } : {}),
                },
                otherWarnings,
                noSignalsInForce: typhoonSignal === null && rainstormSignal === null && otherWarnings.length === 0,
            };
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            throw new Error(`Failed to fetch HK Observatory warning data: ${message}`);
        }
    }
}
