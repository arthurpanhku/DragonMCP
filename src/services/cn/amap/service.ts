import axios from 'axios';
import { config } from '../../../config/index.js';
import { AmapPOIResponse, AmapWalkingRouteResponse, AmapDrivingRouteResponse, AmapTransitRouteResponse, AmapBicyclingRouteResponse, AmapPOI } from './types.js';

const AMAP_API_BASE = 'https://restapi.amap.com/v3';

export class AmapService {
    private static get apiKey() {
        return config.external.amap.apiKey;
    }

    /**
     * Search for POIs and return raw data
     */
    static async searchPOIRaw(keywords: string, city?: string): Promise<AmapPOI[]> {
        if (!this.apiKey) {
            console.error('Error: AMAP_API_KEY is not configured in .env');
            return [];
        }

        try {
            const response = await axios.get<AmapPOIResponse>(`${AMAP_API_BASE}/place/text`, {
                params: {
                    key: this.apiKey,
                    keywords,
                    city,
                    offset: 1, // We only need the top result for routing usually
                    page: 1,
                    extensions: 'base',
                },
            });

            if (response.data.status !== '1' || response.data.count === '0') {
                return [];
            }

            return response.data.pois;
        } catch (error) {
            console.error('Amap POI Raw Search Error:', error);
            return [];
        }
    }

    /**
     * Search for POIs (Points of Interest) formatted string
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

    /**
     * Get driving directions
     * @param origin Origin "longitude,latitude"
     * @param destination Destination "longitude,latitude"
     */
    static async getDrivingDirection(origin: string, destination: string): Promise<string> {
        if (!this.apiKey) {
            return 'Error: AMAP_API_KEY is not configured in .env';
        }

        try {
            const response = await axios.get<AmapDrivingRouteResponse>(`${AMAP_API_BASE}/direction/driving`, {
                params: {
                    key: this.apiKey,
                    origin,
                    destination,
                    extensions: 'base',
                    strategy: 0 // 0: Fastest
                },
            });

            if (response.data.status !== '1') {
                return `Amap API Error: ${response.data.info}`;
            }

            const route = response.data.route;
            if (!route.paths.length) {
                return 'No driving route found.';
            }

            const path = route.paths[0];
            const duration = Math.ceil(parseInt(path.duration) / 60); // minutes
            const distance = (parseInt(path.distance) / 1000).toFixed(1); // km

            const steps = path.steps.map(step => `- ${step.instruction} (${step.road})`).join('\n');

            return `Driving Route (Fastest):\nDistance: ${distance} km\nEstimated Time: ${duration} mins\n\nSteps:\n${steps}`;

        } catch (error) {
            console.error('Amap Driving Direction Error:', error);
            return 'Failed to fetch Amap driving direction data.';
        }
    }

    /**
     * Get transit directions (Integrated)
     * @param origin Origin "longitude,latitude"
     * @param destination Destination "longitude,latitude"
     * @param city City name or code
     */
    static async getTransitDirection(origin: string, destination: string, city: string): Promise<string> {
        if (!this.apiKey) {
            return 'Error: AMAP_API_KEY is not configured in .env';
        }

        try {
            const response = await axios.get<AmapTransitRouteResponse>(`${AMAP_API_BASE}/direction/transit/integrated`, {
                params: {
                    key: this.apiKey,
                    origin,
                    destination,
                    city,
                    extensions: 'base',
                },
            });

            if (response.data.status !== '1') {
                return `Amap API Error: ${response.data.info}`;
            }

            const route = response.data.route;
            if (!route.transits || !route.transits.length) {
                return 'No transit route found.';
            }

            const transit = route.transits[0];
            const duration = Math.ceil(parseInt(transit.duration) / 60); // minutes
            const cost = transit.cost;

            const segments = transit.segments.map((segment, index) => {
                let desc = `Step ${index + 1}: `;
                if (segment.walking && segment.walking.distance && parseInt(segment.walking.distance) > 0) {
                    desc += `Walk ${segment.walking.distance}m. `;
                }
                if (segment.bus && segment.bus.buslines && segment.bus.buslines.length > 0) {
                    const bus = segment.bus.buslines[0];
                    desc += `Take bus ${bus.name} from ${bus.departure_stop.name} to ${bus.arrival_stop.name}. `;
                }
                if (segment.railway && segment.railway.name) {
                    const rail = segment.railway;
                    desc += `Take train ${rail.name} (${rail.trip}) from ${rail.departure_stop.name} to ${rail.arrival_stop.name}. `;
                }
                if (segment.taxi && segment.taxi.drive_time) { // Usually segments don't have taxi in transit mode unless mixed?
                    // Amap integrated might return taxi but typically it's bus/railway.
                }
                return desc;
            }).join('\n');

            return `Transit Route:\nEstimated Time: ${duration} mins\nCost: ¥${cost}\n\nSegments:\n${segments}`;

        } catch (error) {
            console.error('Amap Transit Direction Error:', error);
            return 'Failed to fetch Amap transit direction data.';
        }
    }

    /**
     * Get bicycling directions
     * @param origin Origin "longitude,latitude"
     * @param destination Destination "longitude,latitude"
     */
    static async getBicyclingDirection(origin: string, destination: string): Promise<string> {
        if (!this.apiKey) {
            return 'Error: AMAP_API_KEY is not configured in .env';
        }

        try {
            const response = await axios.get<AmapBicyclingRouteResponse>(`${AMAP_API_BASE}/direction/bicycling`, {
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
            if (!route.paths || !route.paths.length) {
                return 'No bicycling route found.';
            }

            const path = route.paths[0];
            const duration = Math.ceil(parseInt(path.duration) / 60); // minutes
            const distance = path.distance;

            const steps = path.steps.map(step => `- ${step.instruction} (${step.road})`).join('\n');

            return `Bicycling Route:\nDistance: ${distance} meters\nEstimated Time: ${duration} mins\n\nSteps:\n${steps}`;

        } catch (error) {
            console.error('Amap Bicycling Direction Error:', error);
            return 'Failed to fetch Amap bicycling direction data.';
        }
    }
}
