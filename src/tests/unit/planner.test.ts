import { planRoute, linesForStation, interchangeStations } from '../../services/hk/mtr/planner';
import { MTR_LINES } from '../../services/hk/mtr/constants';

const allStations = (): string[] => {
    const stations = new Set<string>();
    for (const line of Object.values(MTR_LINES)) {
        line.stations.forEach((station) => stations.add(station));
        for (const branch of line.branches ?? []) {
            branch.stations.forEach((station) => stations.add(station));
        }
    }
    return [...stations];
};

describe('MTR route planner', () => {
    describe('network topology', () => {
        it('serves Mong Kok East on East Rail, and Mong Kok not at all', () => {
            // The upstream API rejects EAL-MOK and accepts EAL-MKK. Treating
            // them as one station would invent an interchange that does not exist.
            expect(linesForStation('MKK')).toEqual(['EAL']);
            expect(linesForStation('MOK').sort()).toEqual(['KTL', 'TWL']);
        });

        it('places East Tsim Sha Tsui on the Tuen Ma Line', () => {
            expect(linesForStation('ETS')).toEqual(['TML']);
        });

        it('treats LOHAS Park and Lok Ma Chau as branches, not through stations', () => {
            // Hang Hau is one stop from Tseung Kwan O; LOHAS Park is not in between.
            const toHangHau = planRoute('TKO', 'HAH');
            expect(toHangHau).toHaveLength(1);
            expect(toHangHau![0].stops).toBe(1);

            const toLohas = planRoute('TKO', 'LHP');
            expect(toLohas).toHaveLength(1);
            expect(toLohas![0].stops).toBe(1);
            // Critically: a LOHAS Park train is not a Po Lam train.
            expect(toLohas![0].termini).toEqual(['LHP']);

            expect(planRoute('SHS', 'LMC')![0].termini).toEqual(['LMC']);
        });

        it('reports both termini where the line splits ahead', () => {
            const legs = planRoute('ADM', 'SHT');
            expect(legs).toHaveLength(1);
            expect(legs![0].termini.sort()).toEqual(['LMC', 'LOW']);
        });
    });

    describe('coverage', () => {
        it('routes every station pair on the network', () => {
            const stations = allStations();
            const failures: string[] = [];

            for (let i = 0; i < stations.length; i++) {
                for (let j = 0; j < stations.length; j++) {
                    if (i === j) continue;
                    const legs = planRoute(stations[i], stations[j]);
                    if (!legs || legs.length === 0) failures.push(`${stations[i]}->${stations[j]}`);
                }
            }

            expect(failures).toEqual([]);
        });

        it('keeps every journey within four transfers', () => {
            const stations = allStations();
            let worst = 0;

            for (let i = 0; i < stations.length; i++) {
                for (let j = i + 1; j < stations.length; j++) {
                    worst = Math.max(worst, planRoute(stations[i], stations[j])!.length - 1);
                }
            }

            expect(worst).toBeLessThanOrEqual(4);
        });

        it('produces legs that chain end to end', () => {
            const legs = planRoute('TUC', 'LHP')!;
            expect(legs.length).toBeGreaterThan(1);

            for (let i = 1; i < legs.length; i++) {
                expect(legs[i].from).toBe(legs[i - 1].to);
                expect(legs[i].line).not.toBe(legs[i - 1].line);
            }
            expect(legs[0].from).toBe('TUC');
            expect(legs[legs.length - 1].to).toBe('LHP');
        });
    });

    describe('direct routes', () => {
        it('needs no transfer between two stations on one line', () => {
            const legs = planRoute('ADM', 'CEN');
            expect(legs).toHaveLength(1);
            expect(legs![0]).toMatchObject({ line: 'ISL', direction: 'DOWN', stops: 1, termini: ['KET'] });
        });

        it('returns an empty journey when origin and destination match', () => {
            expect(planRoute('CEN', 'CEN')).toEqual([]);
        });

        it('returns null for unknown stations', () => {
            expect(planRoute('CEN', 'NOPE')).toBeNull();
        });
    });

    describe('transfers', () => {
        it('routes Central to Sha Tin without inventing a Mong Kok interchange', () => {
            const legs = planRoute('CEN', 'SHT')!;
            expect(legs.length).toBeGreaterThan(1);
            expect(legs.map((leg) => leg.to)).not.toContain('MOK');
            expect(legs[legs.length - 1].line).toBe('EAL');
        });

        it('reports the real interchange stations', () => {
            const interchanges = interchangeStations();
            expect(interchanges).toContain('ADM');
            expect(interchanges).toContain('KOT');
            expect(interchanges).toContain('NAC');
            // Mong Kok East is East Rail only; it is not an interchange.
            expect(interchanges).not.toContain('MKK');
        });
    });
});
