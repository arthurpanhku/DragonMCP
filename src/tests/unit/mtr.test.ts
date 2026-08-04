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

    it('should describe each leg of a journey that needs a transfer', async () => {
        const result = await MTRService.getNextTrains('Central', 'Sha Tin');

        expect(result).toContain('Central to Sha Tin');
        expect(result).toContain('1 transfer');
        expect(result).toContain('Leg 1:');
        expect(result).toContain('Leg 2:');
        expect(result).toContain('East Rail Line');
        expect(result).toContain('minimises transfers, not travel time');
        // Real-time is only meaningful where we know the rider is standing.
        expect(result).toContain('boarding leg only');
    });

    it('should still return the route when real-time data is unavailable', async () => {
        // Prince Edward is a real station the Next Train API does not serve.
        const result = await MTRService.getNextTrains('Prince Edward', 'Mong Kok');

        expect(result).toContain('Prince Edward');
        expect(result).toContain('Mong Kok');
        expect(result).toContain('Real-time arrivals unavailable');
        expect(axiosGetSpy).not.toHaveBeenCalled();
    });

    it('should report unknown stations rather than guessing', async () => {
        expect(await MTRService.getNextTrains('Atlantis', 'Central')).toContain('Station not found: Atlantis');
    });
});
