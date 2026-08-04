import { AmapService } from "../../cn/amap/service.js";
import { MTRService } from "../../hk/mtr/service.js";

export class CrossBorderTransitService {
    /**
     * Unified transit search across Hong Kong and Mainland China
     * @param from Origin (Address, POI, or Coordinates)
     * @param to Destination (Address, POI, or Coordinates)
     * @param region Region code (HK, CN)
     * @param city Optional city name (helpful for POI resolution)
     */
    static async searchRoute(from: string, to: string, region: string, city?: string): Promise<string> {
        const regionCode = region.toUpperCase();

        switch (regionCode) {
            case 'HK': // Hong Kong -> MTR real-time schedule
                return await this.handleHKRoute(from, to);

            case 'CN': // Mainland China -> Amap
                return await this.handleCNRoute(from, to, city);

            default:
                return `Region '${region}' not supported. Supported: HK, CN.`;
        }
    }

    private static async handleHKRoute(from: string, to: string): Promise<string> {
        const mtrResult = await MTRService.getNextTrains(from, to);

        if (!mtrResult.includes('Station not found')) {
            return `[MTR Route]\n${mtrResult}`;
        }

        return `Hong Kong routing currently covers MTR station-to-station queries only.\n` +
            `Use MTR station names (e.g. "Central", "Admiralty", "Lo Wu", "金钟").\n` +
            `Your query: ${from} -> ${to}`;
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
