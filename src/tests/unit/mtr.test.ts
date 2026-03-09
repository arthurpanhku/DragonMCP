import { MTRService } from '../../services/hk/mtr/service';
import axios from 'axios';
import { jest } from '@jest/globals';

describe('MTRService', () => {
    const mockResponse = {
        status: 1,
        message: 'successful',
        sys_time: '2024-03-08 10:30:00',
        curr_time: '2024-03-08 10:30:00',
        isdelay: 'N',
        data: {
            'ISL-ADM': {
                curr_time: '2024-03-08 10:30:00',
                sys_time: '2024-03-08 10:30:00',
                DOWN: [
                    {
                        ttnt: '3',
                        valid: 'Y',
                        plat: '2',
                        time: '2024-03-08 10:33:00',
                        source: '-',
                        dest: 'KET',
                        seq: '1',
                    },
                ],
                UP: [],
            },
        },
    };

    let axiosGetSpy: any;

    beforeEach(() => {
        axiosGetSpy = jest.spyOn(axios, 'get').mockResolvedValue({ data: mockResponse } as any);
    });

    afterEach(() => {
        axiosGetSpy.mockRestore();
    });

    it('should find station codes correctly', () => {
        expect(MTRService.findStationCode('Admiralty')).toBe('ADM');
        expect(MTRService.findStationCode('Central')).toBe('CEN');
        expect(MTRService.findStationCode('金钟')).toBe('ADM');
        expect(MTRService.findStationCode('unknown')).toBeNull();
    });

    it('should find route and direction correctly', () => {
        // Admiralty to Central (ISL) -> DOWN (towards KET)
        const route = MTRService.findRoute('ADM', 'CEN');
        // ISL is defined first in constants, so it should be picked first
        expect(route).toEqual({ line: 'ISL', direction: 'DOWN' });
    });

    it('should fetch next trains correctly', async () => {
        const result = await MTRService.getNextTrains('Admiralty', 'Central');

        // Check if result contains key information
        // We expect it to find ISL line
        expect(result).toContain('Next Island Line train');
        expect(result).toContain('Admiralty');
        expect(result).toContain('Central');
        expect(result).toContain('3 min(s)');

        expect(axiosGetSpy).toHaveBeenCalled();
    });
});
