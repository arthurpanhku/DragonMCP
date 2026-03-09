import axios from 'axios';
import { HKWeatherResponse } from './types.js';

const HK_WEATHER_API_BASE = 'https://data.weather.gov.hk/weatherAPI/opendata/weather.php';

export class HKWeatherService {
    /**
     * Get current weather report from Hong Kong Observatory
     */
    static async getCurrentWeather(): Promise<string> {
        try {
            const response = await axios.get<HKWeatherResponse>(HK_WEATHER_API_BASE, {
                params: {
                    dataType: 'rhrread',
                    lang: 'en'
                }
            });

            const data = response.data;
            const temp = data.temperature.data.find(t => t.place === 'Hong Kong Observatory')?.value;
            const hum = data.humidity.data[0]?.value;
            const warnings = data.warningMessage ? data.warningMessage.join('\n') : 'No warnings';

            let report = `Current Weather in Hong Kong (Updated: ${data.updateTime}):\n`;
            report += `- Temperature: ${temp}°C\n`;
            report += `- Humidity: ${hum}%\n`;

            if (data.uvindex && data.uvindex.data && data.uvindex.data.length > 0) {
                report += `- UV Index: ${data.uvindex.data[0].value} (${data.uvindex.data[0].desc})\n`;
            }

            if (data.rainfall && data.rainfall.data && data.rainfall.data.length > 0) {
                const rain = data.rainfall.data.find(r => r.place === 'Hong Kong');
                if (rain) {
                    report += `- Rainfall: ${rain.max}mm\n`;
                }
            }

            report += `\nWarnings:\n${warnings}`;

            return report;
        } catch (error) {
            console.error('HK Weather API Error:', error);
            return 'Failed to fetch HK weather data.';
        }
    }
}
