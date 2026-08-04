import axios from 'axios';
import { MTR_LINES, MTR_STATIONS, STATIONS_WITHOUT_REALTIME } from './constants.js';
import { MTRScheduleResponse, MTRTrainInfo, RouteLeg } from './types.js';
import { planRoute } from './planner.js';

const API_BASE_URL = 'https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php';

type ArrivalResult =
    | { trains: MTRTrainInfo[] }
    | { unavailable: string };

const stationName = (code: string): string => MTR_STATIONS[code]?.name.en ?? code;
const lineName = (code: string): string => MTR_LINES[code]?.name.en ?? code;
const plural = (count: number, noun: string): string => `${count} ${noun}${count === 1 ? '' : 's'}`;

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
     * Real-time arrivals for one boarding station, in one direction.
     * Never throws: an unavailable upstream is reported, not hidden.
     */
    static async fetchArrivals(leg: RouteLeg): Promise<ArrivalResult> {
        if (STATIONS_WITHOUT_REALTIME.has(leg.from)) {
            return { unavailable: `MTR does not publish real-time arrivals for ${stationName(leg.from)}.` };
        }

        try {
            const response = await axios.get<MTRScheduleResponse>(API_BASE_URL, {
                params: { line: leg.line, sta: leg.from },
            });

            const data = response.data;
            if (data.status !== 1) {
                return { unavailable: `MTR API returned an error: ${data.message || 'unknown'}.` };
            }

            const stationData = data.data?.[`${leg.line}-${leg.from}`];
            if (!stationData) {
                return { unavailable: `MTR API returned no data for ${leg.line} at ${stationName(leg.from)}.` };
            }

            const trains = leg.direction === 'UP' ? stationData.UP : stationData.DOWN;
            if (!trains || trains.length === 0) {
                return { unavailable: `No upcoming ${leg.direction} trains reported at ${stationName(leg.from)}.` };
            }

            return { trains };
        } catch (error) {
            console.error('MTR API Error:', error);
            return { unavailable: 'Failed to reach the MTR API.' };
        }
    }

    /**
     * Plan a journey and attach real-time arrivals for the boarding leg.
     *
     * Routes minimise transfers, not travel time — we have no inter-station
     * running times, so claiming "fastest" would be a guess.
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

        const legs = planRoute(fromCode, toCode);
        if (!legs || legs.length === 0) {
            return `No route found between ${stationName(fromCode)} and ${stationName(toCode)}.`;
        }

        const arrivals = await this.fetchArrivals(legs[0]);

        return legs.length === 1
            ? this.formatDirect(legs[0], arrivals)
            : this.formatJourney(fromCode, toCode, legs, arrivals);
    }

    private static describeLeg(leg: RouteLeg): string {
        const towards = leg.termini.map(stationName).join(' / ');
        return `${lineName(leg.line)} from ${stationName(leg.from)} to ${stationName(leg.to)} ` +
            `(towards ${towards}), ${plural(leg.stops, 'stop')}`;
    }

    private static formatArrivals(arrivals: ArrivalResult, indent: string): string {
        if ('unavailable' in arrivals) {
            return `${indent}Real-time arrivals unavailable: ${arrivals.unavailable}\n`;
        }

        const [next, ...rest] = arrivals.trains;
        let text = `${indent}- Arriving in: ${next.ttnt} min(s) (${next.time.split(' ')[1]})\n`;

        const subsequent = rest.slice(0, 2);
        if (subsequent.length > 0) {
            text += `${indent}Subsequent trains:\n`;
            for (const train of subsequent) {
                text += `${indent}- ${train.ttnt} min(s) (${train.time.split(' ')[1]})\n`;
            }
        }

        return text;
    }

    private static formatDirect(leg: RouteLeg, arrivals: ArrivalResult): string {
        const towards = leg.termini.map(stationName).join(' / ');

        if ('unavailable' in arrivals) {
            return `${this.describeLeg(leg)}.\n` +
                `Real-time arrivals unavailable: ${arrivals.unavailable}\n`;
        }

        const header = `Next ${lineName(leg.line)} train from ${stationName(leg.from)} ` +
            `to ${stationName(leg.to)} (towards ${towards}):\n`;

        return header + this.formatArrivals(arrivals, '');
    }

    private static formatJourney(
        fromCode: string,
        toCode: string,
        legs: RouteLeg[],
        arrivals: ArrivalResult,
    ): string {
        const transfers = legs.length - 1;
        const stops = legs.reduce((total, leg) => total + leg.stops, 0);

        let text = `${stationName(fromCode)} to ${stationName(toCode)} — ` +
            `${plural(transfers, 'transfer')}, ${plural(stops, 'stop')}.\n` +
            `Route minimises transfers, not travel time.\n\n`;

        legs.forEach((leg, index) => {
            text += `Leg ${index + 1}: ${this.describeLeg(leg)}\n`;
            if (index === 0) {
                text += this.formatArrivals(arrivals, '  ');
            } else {
                text += `  Transfer at ${stationName(leg.from)}.\n`;
            }
        });

        text += `\nReal-time arrivals are shown for the boarding leg only.\n`;
        return text;
    }
}
