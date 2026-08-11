import axios from 'axios';
import { TyphoonSignalResponse, TyphoonSignalCode, RainstormSignalCode, HKOWarningInfoResponse, TyphoonSignal, RainstormSignal, OtherWarning } from './types.js';

const HKO_WARNING_API = 'https://www.weather.gov.hk/warninfo/warninginfo.php';

const TYPHOON_SIGNAL_MAP: Record<number, { code: TyphoonSignalCode; description: string }> = {
    0: { code: 'nil', description: 'No tropical cyclone signal' },
    1: { code: '1', description: 'Tropical Cyclone Signal No. 1' },
    3: { code: '3', description: 'Tropical Cyclone Signal No. 3' },
    8: { code: '8NE', description: 'Tropical Cyclone Signal No. 8 (North-East)' },
    9: { code: '8SE', description: 'Tropical Cyclone Signal No. 8 (South-East)' },
    10: { code: '8NW', description: 'Tropical Cyclone Signal No. 8 (North-West)' },
    11: { code: '8SW', description: 'Tropical Cyclone Signal No. 8 (South-West)' },
    12: { code: '9', description: 'Tropical Cyclone Signal No. 9' },
    13: { code: '10', description: 'Severe Tropical Storm Signal No. 10' },
};

const RAINSTORM_SIGNAL_MAP: Record<number, { code: RainstormSignalCode; description: string }> = {
    0: { code: 'nil', description: 'No rainstorm warning' },
    1: { code: 'amber', description: 'Amber Rainstorm Warning' },
    2: { code: 'red', description: 'Red Rainstorm Warning' },
    3: { code: 'black', description: 'Black Rainstorm Warning' },
};

export class TyphoonSignalService {
    static async getTyphoonSignals(): Promise<TyphoonSignalResponse> {
        try {
            const response = await axios.get<HKOWarningInfoResponse>(HKO_WARNING_API, {
                params: { lang: 'en' },
                timeout: 10000,
            });
            return this.parseWarningData(response.data);
        } catch (error) {
            console.error('HKO Typhoon Signal API Error:', error);
            throw new Error('Failed to fetch typhoon signal data from HKO.');
        }
    }

    private static parseWarningData(data: HKOWarningInfoResponse): TyphoonSignalResponse {
        const updateTime = data.updateTime || new Date().toISOString();

        const tc = data.tropicalCycloneWarning || { warningType: 0, warningDesc: 'No tropical cyclone warning in force' };
        const rs = data.rainstormWarning || { warningType: 0, warningDesc: 'No rainstorm warning in force' };

        const tcType = parseInt(String(tc.warningType), 10);
        const rsType = parseInt(String(rs.warningType), 10);

        const typhoonSignal: TyphoonSignal = {
            code: TYPHOON_SIGNAL_MAP[tcType]?.code ?? 'nil',
            description: tc.warningDesc,
            issuedTime: updateTime,
        };

        const rainstormSignal: RainstormSignal = {
            code: RAINSTORM_SIGNAL_MAP[rsType]?.code ?? 'nil',
            description: rs.warningDesc,
            issuedTime: updateTime,
        };

        const otherWarnings: OtherWarning[] = [];

        const checkWarning = (type: string, warn?: any | any[]) => {
            if (!warn) return;
            const list = Array.isArray(warn) ? warn : [warn];
            for (const w of list) {
                const wType = parseInt(String(w.warningType), 10);
                if (wType > 0) {
                    otherWarnings.push({
                        type: type.toUpperCase(),
                        description: w.warningDesc,
                        issuedTime: updateTime,
                    });
                }
            }
        };

        checkWarning('thunderstorm', data.thunderstormWarning);
        checkWarning('landslide', data.landslideWarning);
        checkWarning('cold', data.coldWeatherWarning);
        checkWarning('hot', data.veryHotWeatherWarning);
        checkWarning('monsoon', data.strongMonsoonWarning);

        return {
            typhoonSignal,
            rainstormSignal,
            otherWarnings,
        };
    }
}
