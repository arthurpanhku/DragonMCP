import axios from 'axios';
import { config } from '../../../config/index.js';
import { AmapPOIResponse, AmapWalkingRouteResponse } from './types.js';

const AMAP_API_BASE = 'https://restapi.amap.com/v3';

export class AmapService {
    private static get apiKey() {
        return config.external.amap.apiKey;
    }

    /**
     * Search for POIs (Points of Interest)
     * @param keywords Keywords to search for (e.g. "restaurant", "hotel")
     * @param city City name or code (optional)
     */
    static async searchPOI(keywords: string, city?: string): Promise<string> {
        if (!this.apiKey) {
            return 'Error: AMAP_API_KEY is not configured in .env';
        }

        try {
            const response = await axios.get<AmapPOIResponse>(`${AMAP_API_BASE}/place/text`, {
                params: {
                    key: this.apiKey,
                    keywords,
                    city,
                    offset: 5, // Limit results
                    page: 1,
                    extensions: 'base',
                },
            });

            if (response.data.status !== '1') {
                return `Amap API Error: ${response.data.info}`;
            }

            if (response.data.count === '0' || !response.data.pois.length) {
                return `No results found for "${keywords}"${city ? ` in ${city}` : ''}.`;
            }

            const pois = response.data.pois.map(poi =>
                `- ${poi.name} (${poi.type})\n  Address: ${poi.address}\n  Location: ${poi.location}`
            ).join('\n');

            return `Found ${response.data.count} results for "${keywords}":\n${pois}`;

        } catch (error) {
            console.error('Amap POI Search Error:', error);
            return 'Failed to fetch Amap data. Please try again later.';
        }
    }

    /**
     * Get walking directions
     * @param origin Origin "longitude,latitude"
     * @param destination Destination "longitude,latitude"
     */
    static async getWalkingDirection(origin: string, destination: string): Promise<string> {
        if (!this.apiKey) {
            return 'Error: AMAP_API_KEY is not configured in .env';
        }

        try {
            const response = await axios.get<AmapWalkingRouteResponse>(`${AMAP_API_BASE}/direction/walking`, {
                params: {
                    key: this.apiKey,
                    origin,
                    destination,
                },
            });

            if (response.data.status !== '1') {
                return `Amap API Error: ${response.data.info}`;
            }

            const route = response.data.route;
            if (!route.paths.length) {
                return 'No walking route found.';
            }

            const path = route.paths[0];
            const duration = Math.ceil(parseInt(path.duration) / 60); // minutes
            const distance = path.distance;

            const steps = path.steps.map(step => `- ${step.instruction}`).join('\n');

            return `Walking Route:\nDistance: ${distance} meters\nEstimated Time: ${duration} mins\n\nSteps:\n${steps}`;

        } catch (error) {
            console.error('Amap Direction Error:', error);
            return 'Failed to fetch Amap direction data.';
        }
    }
}
