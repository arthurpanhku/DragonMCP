import { MTRService } from "../../hk/mtr/service.js";
import { AmapService } from "../../cn/amap/service.js";
import { HKWeatherService } from "../../hk/weather/service.js";
import { TestResult, SystemHealthReport } from "./types.js";

export class TestService {
    /**
     * Run a self-test of all critical services
     */
    static async runSelfTest(): Promise<SystemHealthReport> {
        const results: TestResult[] = [];
        const startTime = Date.now();

        // 1. Test MTR Service
        results.push(await this.testMTR());

        // 2. Test Amap Service
        results.push(await this.testAmap());

        // 3. Test HK Weather Service
        results.push(await this.testHKWeather());

        // Summarize
        const passedTests = results.filter(r => r.status === 'PASS').length;

        return {
            timestamp: new Date().toISOString(),
            totalTests: results.length,
            passedTests,
            failedTests: results.length - passedTests,
            results
        };
    }

    private static async testMTR(): Promise<TestResult> {
        const start = Date.now();
        try {
            const result = await MTRService.getNextTrains('Admiralty', 'Central');
            // Check if result contains error keywords
            if (result.includes('Error') || result.includes('Failed')) {
                return {
                    service: 'MTR (HK)',
                    tool: 'search_mtr_schedule',
                    status: 'FAIL',
                    message: result,
                    duration: Date.now() - start
                };
            }
            return {
                service: 'MTR (HK)',
                tool: 'search_mtr_schedule',
                status: 'PASS',
                message: 'Successfully fetched train schedule.',
                duration: Date.now() - start
            };
        } catch (error: any) {
            return {
                service: 'MTR (HK)',
                tool: 'search_mtr_schedule',
                status: 'FAIL',
                message: error.message || 'Unknown error',
                duration: Date.now() - start
            };
        }
    }

    private static async testAmap(): Promise<TestResult> {
        const start = Date.now();
        try {
            // Test POI Search
            const result = await AmapService.searchPOI('KFC', 'Beijing');
            if (result.includes('Error') || result.includes('Failed')) {
                return {
                    service: 'Amap (CN)',
                    tool: 'amap_search_poi',
                    status: 'FAIL',
                    message: result,
                    duration: Date.now() - start
                };
            }
            return {
                service: 'Amap (CN)',
                tool: 'amap_search_poi',
                status: 'PASS',
                message: 'Successfully searched POI.',
                duration: Date.now() - start
            };
        } catch (error: any) {
            return {
                service: 'Amap (CN)',
                tool: 'amap_search_poi',
                status: 'FAIL',
                message: error.message || 'Unknown error',
                duration: Date.now() - start
            };
        }
    }

    private static async testHKWeather(): Promise<TestResult> {
        const start = Date.now();
        try {
            const result = await HKWeatherService.getCurrentWeather();
            if (result.includes('Error') || result.includes('Failed')) {
                return {
                    service: 'Weather (HK)',
                    tool: 'hk_weather_current',
                    status: 'FAIL',
                    message: result,
                    duration: Date.now() - start
                };
            }
            return {
                service: 'Weather (HK)',
                tool: 'hk_weather_current',
                status: 'PASS',
                message: 'Successfully fetched weather report.',
                duration: Date.now() - start
            };
        } catch (error: any) {
            return {
                service: 'Weather (HK)',
                tool: 'hk_weather_current',
                status: 'FAIL',
                message: error.message || 'Unknown error',
                duration: Date.now() - start
            };
        }
    }
}
