import axios from 'axios';
import { MTR_LINES, MTR_STATIONS } from './constants.js';
import { MTRScheduleResponse, MTRTrainInfo } from './types.js';

const API_BASE_URL = 'https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php';

export class MTRService {
    /**
     * Find station code by name (case-insensitive, English or Chinese)
     */
    static findStationCode(name: string): string | null {
        const normalizedName = name.toLowerCase().trim();
        for (const [code, station] of Object.entries(MTR_STATIONS)) {
            if (
                station.name.en.toLowerCase() === normalizedName ||
                station.name.zh === normalizedName ||
                code.toLowerCase() === normalizedName
            ) {
                return code;
            }
        }
        return null;
    }

    /**
     * Find the line connecting two stations and the direction
     */
    static findRoute(fromCode: string, toCode: string): { line: string; direction: 'UP' | 'DOWN' } | null {
        for (const [lineCode, line] of Object.entries(MTR_LINES)) {
            const fromIndex = line.stations.indexOf(fromCode);
            const toIndex = line.stations.indexOf(toCode);

            if (fromIndex !== -1 && toIndex !== -1) {
                // Found both stations on this line
                // UP is increasing index (e.g. KET -> CHW)
                // DOWN is decreasing index (e.g. CHW -> KET)

                // ISL: KET(0) -> ... -> CHW(16). UP is towards CHW.
                // TWL: CEN(0) -> ... -> TSW(15). UP is towards TSW.

                // Wait, for ISL, UP is towards Chai Wan (CHW).
                // Let's verify with my constants.
                // ISL stations: KET, ..., CHW.
                // If fromIndex < toIndex, moving towards end of array (CHW). So UP.

                const direction = fromIndex < toIndex ? 'UP' : 'DOWN';
                return { line: lineCode, direction };
            }
        }
        return null;
    }

    /**
     * Get next trains
     */
    static async getNextTrains(from: string, to: string): Promise<string> {
        const fromCode = this.findStationCode(from);
        const toCode = this.findStationCode(to);

        if (!fromCode || !toCode) {
            return `Station not found: ${!fromCode ? from : to}`;
        }

        if (fromCode === toCode) {
            return 'Start and end stations are the same.';
        }

        const route = this.findRoute(fromCode, toCode);
        if (!route) {
            return `No direct line found between ${from} and ${to}. Please try a transfer or check station names. (Currently supporting Island Line and Tsuen Wan Line)`;
        }

        try {
            const response = await axios.get<MTRScheduleResponse>(API_BASE_URL, {
                params: {
                    line: route.line,
                    sta: fromCode,
                },
            });

            const data = response.data;
            if (data.status !== 1) {
                return 'MTR API returned an error or is unavailable.';
            }

            const stationData = data.data[`${route.line}-${fromCode}`];
            if (!stationData) {
                return `No real-time data available for ${route.line} at ${fromCode}.`;
            }

            const trains = route.direction === 'UP' ? stationData.UP : stationData.DOWN;

            if (!trains || trains.length === 0) {
                return `No upcoming trains found from ${from} to ${to} (${route.line}).`;
            }

            // Format output
            const lineName = MTR_LINES[route.line].name.en;
            const destName = route.direction === 'UP'
                ? MTR_STATIONS[MTR_LINES[route.line].upDest].name.en
                : MTR_STATIONS[MTR_LINES[route.line].downDest].name.en;

            const nextTrain = trains[0];
            const subsequentTrains = trains.slice(1, 3);

            let result = `Next ${lineName} train from ${MTR_STATIONS[fromCode].name.en} to ${MTR_STATIONS[toCode].name.en} (towards ${destName}):\n`;
            result += `- Arriving in: ${nextTrain.ttnt} min(s) (${nextTrain.time.split(' ')[1]})\n`;

            if (subsequentTrains.length > 0) {
                result += `Subsequent trains:\n`;
                subsequentTrains.forEach(t => {
                    result += `- ${t.ttnt} min(s) (${t.time.split(' ')[1]})\n`;
                });
            }

            return result;

        } catch (error) {
            console.error('MTR API Error:', error);
            return 'Failed to fetch MTR data. Please try again later.';
        }
    }
}
