import { AmapService } from "../../cn/amap/service.js";
import { MTRService } from "../../hk/mtr/service.js";

export class AsiaTransitService {
    /**
     * Unified search for transit routes across Asia
     * @param from Origin (Address, POI, or Coordinates)
     * @param to Destination (Address, POI, or Coordinates)
     * @param region Region code (CN, HK, JP, KR, SG)
     * @param city Optional city name (helpful for POI resolution)
     */
    static async searchRoute(from: string, to: string, region: string, city?: string): Promise<string> {
        const regionCode = region.toUpperCase();

        switch (regionCode) {
            case 'CN': // Mainland China -> Amap
                return await this.handleCNRoute(from, to, city);

            case 'HK': // Hong Kong -> MTR (for stations) or General
                // Try MTR first if both look like stations
                // Note: MTRService.getNextTrains returns a string. If it fails, it usually returns "Station not found..."
                try {
                    const mtrResult = await MTRService.getNextTrains(from, to);
                    if (!mtrResult.includes('Station not found')) {
                        return `[MTR Route]\n${mtrResult}`;
                    }
                } catch (e) {
                    // Ignore MTR error and fallback
                }

                // Fallback to general advice (or future Amap HK support)
                return `For Hong Kong, currently only MTR station-to-station queries are supported directly.\nTry querying specific stations (e.g. "Central", "Admiralty").\nYour query: ${from} -> ${to}`;

            case 'JP': // Japan -> Mock Yahoo! Transit
                return `[Japan Transit - Mock]\nRoute from ${from} to ${to}:\n1. Walk to ${from} Station (5 min)\n2. Take JR Yamanote Line to ${to} Station (15 min)\n3. Walk to destination (3 min)\nCost: ¥200`;

            case 'KR': // Korea -> Mock Naver Maps
                return `[Korea Transit - Mock]\nRoute from ${from} to ${to}:\n1. Walk to nearest subway (3 min)\n2. Take Line 2 to Gangnam (20 min)\n3. Transfer to Bus 402 (10 min)\nCost: ₩1,350`;

            case 'SG': // Singapore -> Mock Grab/Public
                return `[Singapore Transit - Mock]\nOption 1 (MRT): Take EW Line from ${from} to ${to} (25 min, SGD 1.50)\nOption 2 (Grab): Book a ride (~15 min, SGD 12.00)`;

            default:
                return `Region '${region}' not supported yet. Supported: CN, HK, JP, KR, SG.`;
        }
    }

    private static async handleCNRoute(from: string, to: string, city?: string): Promise<string> {
        // 1. Resolve Origin
        let originLoc = from;
        if (!this.isCoordinates(from)) {
            const pois = await AmapService.searchPOIRaw(from, city);
            if (!pois || pois.length === 0) {
                return `Could not find location for origin: "${from}"${city ? ` in ${city}` : ''}`;
            }
            originLoc = pois[0].location; // "lng,lat"
        }

        // 2. Resolve Destination
        let destLoc = to;
        if (!this.isCoordinates(to)) {
            const pois = await AmapService.searchPOIRaw(to, city);
            if (!pois || pois.length === 0) {
                return `Could not find location for destination: "${to}"${city ? ` in ${city}` : ''}`;
            }
            destLoc = pois[0].location;
        }

        // 3. Get Transit Route
        return await AmapService.getTransitDirection(originLoc, destLoc, city || '');
    }

    private static isCoordinates(str: string): boolean {
        // Simple check for "lng,lat" format (e.g. "116.4,39.9")
        return /^\d+(\.\d+)?,\d+(\.\d+)?$/.test(str);
    }
}
