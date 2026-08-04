import axios from 'axios';
import { jest } from '@jest/globals';
import { HKTropicalWarningService } from '../../services/hk/typhoon/service.js';

describe('HKTropicalWarningService', () => {
    let axiosGetSpy: any;

    afterEach(() => {
        axiosGetSpy?.mockRestore();
    });

    it('returns structured typhoon, rainstorm, and other active warnings', async () => {
        axiosGetSpy = jest.spyOn(axios, 'get')
            .mockResolvedValueOnce({
                data: {
                    WTCSGNL: { name: 'Tropical Cyclone Warning Signal', code: 'WTCSGNL', issueTime: '2026-08-04T08:00:00+08:00' },
                    WRAIN: { name: 'Rainstorm Warning Signal', code: 'WRAIN', issueTime: '2026-08-04T09:00:00+08:00' },
                    WTS: { name: 'Thunderstorm Warning', code: 'WTS', updateTime: '2026-08-04T09:30:00+08:00' },
                },
            } as any)
            .mockResolvedValueOnce({
                data: {
                    details: [
                        { warningStatementCode: 'WTCSGNL', subtype: 'TC8NE', contents: ['Signal No. 8 Northeast Gale or Storm.'] },
                        { warningStatementCode: 'WRAIN', subtype: 'WRAINR', contents: ['Red Rainstorm Warning Signal.'] },
                        { warningStatementCode: 'WTS', contents: ['Thunderstorms are expected.'] },
                    ],
                },
            } as any);

        const result = await HKTropicalWarningService.getWarningStatus();

        expect(result.typhoon).toEqual({ signal: '8NE', issueTime: '2026-08-04T08:00:00+08:00' });
        expect(result.rainstorm).toEqual({ signal: 'red', issueTime: '2026-08-04T09:00:00+08:00' });
        expect(result.otherWarnings).toEqual([{
            code: 'WTS',
            name: 'Thunderstorm Warning',
            updateTime: '2026-08-04T09:30:00+08:00',
            details: ['Thunderstorms are expected.'],
        }]);
        expect(result.noSignalsInForce).toBe(false);
    });

    it('reports a clear no-signals state', async () => {
        axiosGetSpy = jest.spyOn(axios, 'get')
            .mockResolvedValueOnce({ data: {} } as any)
            .mockResolvedValueOnce({ data: { details: [] } } as any);

        await expect(HKTropicalWarningService.getWarningStatus()).resolves.toEqual({
            typhoon: { signal: null },
            rainstorm: { signal: null },
            otherWarnings: [],
            noSignalsInForce: true,
        });
    });

    it('uses the warning summary code when detail subtypes are absent', async () => {
        axiosGetSpy = jest.spyOn(axios, 'get')
            .mockResolvedValueOnce({
                data: {
                    WTCSGNL: { name: 'Tropical Cyclone Warning Signal', code: 'TC3' },
                    WRAIN: { name: 'Rainstorm Warning Signal', code: 'WRAINA' },
                },
            } as any)
            .mockResolvedValueOnce({ data: { details: [] } } as any);

        const result = await HKTropicalWarningService.getWarningStatus();

        expect(result.typhoon.signal).toBe('3');
        expect(result.rainstorm.signal).toBe('amber');
    });

    it('fails explicitly when the Observatory cannot be reached', async () => {
        axiosGetSpy = jest.spyOn(axios, 'get').mockRejectedValue(new Error('upstream unavailable'));

        await expect(HKTropicalWarningService.getWarningStatus()).rejects.toThrow(
            'Failed to fetch HK Observatory warning data: upstream unavailable',
        );
    });
});
