import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { MTRService } from "../services/hk/mtr/service.js";
import { HKWeatherService } from "../services/hk/weather/service.js";
import { HKTropicalWarningService } from "../services/hk/typhoon/service.js";
import { AmapService } from "../services/cn/amap/service.js";
import { TestService } from "../services/system/test/service.js";
import { CrossBorderTransitService } from "../services/aggregator/cross_border/service.js";

// Create a fresh MCP server for each stateful transport session.
export const createMcpServer = (): McpServer => {
    const mcpServer = new McpServer({
        name: "DragonMCP",
        version: "0.4.0",
    });

mcpServer.tool(
    "system_run_selftest",
    "Run a live health check against every upstream data source (MTR, HK Observatory, Amap). Returns which sources are reachable right now.",
    {},
    async () => {
        const report = await TestService.runSelfTest();
        const summary = `System Health Report (Tests: ${report.passedTests}/${report.totalTests} Passed)\n` +
            report.results.map(r =>
                `[${r.status}] ${r.service} - ${r.tool} (${r.duration}ms)\n   ${r.message}`
            ).join('\n');

        return {
            content: [{ type: "text", text: summary }],
        };
    }
);

mcpServer.tool(
    "search_transit_route",
    "Unified transit search for Hong Kong and Mainland China. Routes HK queries to live MTR schedules and CN queries to Amap transit planning.",
    {
        from: z.string().describe("Origin (Address, Station Name, or Coordinates)"),
        to: z.string().describe("Destination (Address, Station Name, or Coordinates)"),
        region: z.enum(["HK", "CN"]).describe("Region code"),
        city: z.string().optional().describe("City name (helpful for POI resolution in CN)"),
    },
    async ({ from, to, region, city }) => {
        const result = await CrossBorderTransitService.searchRoute(from, to, region, city);
        return {
            content: [{ type: "text", text: result }],
        };
    }
);

// -------------------------------------------------------------------------
// Hong Kong (data.gov.hk — no API key required)
// -------------------------------------------------------------------------

mcpServer.tool(
    "search_mtr_schedule",
    "Plan an MTR journey between any two stations and get real-time arrivals for the boarding leg. Covers all 10 lines and all 98 stations, including transfers. Routes minimise the number of transfers, not travel time — no inter-station running times are available, so this does not claim to find the fastest route.",
    {
        from: z.string().describe("Starting station name in English or Chinese (e.g., Admiralty, Central, Lo Wu, 金钟)"),
        to: z.string().describe("Destination station name"),
    },
    async ({ from, to }) => {
        const result = await MTRService.getNextTrains(from, to);
        return {
            content: [{ type: "text", text: result }],
        };
    }
);

mcpServer.tool(
    "hk_weather_current",
    "Get the current weather report and active warnings from the Hong Kong Observatory",
    {},
    async () => {
        const result = await HKWeatherService.getCurrentWeather();
        return {
            content: [{ type: "text", text: result }],
        };
    }
);

mcpServer.tool(
    "hk_typhoon_signal",
    "Get structured active tropical cyclone, rainstorm, and other weather warnings from the Hong Kong Observatory. Returns the tropical cyclone signal (null, 1, 3, 8NE, 8SE, 8SW, 8NW, 9, 10), the rainstorm signal (null, amber, red, black), issue and update times, and any other warnings in force.",
    {},
    async () => {
        const result = await HKTropicalWarningService.getWarningStatus();
        return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
    }
);

// -------------------------------------------------------------------------
// Mainland China (Amap — requires AMAP_API_KEY)
// -------------------------------------------------------------------------

mcpServer.tool(
    "amap_search_poi",
    "Search for Places of Interest (POI) in Mainland China using Amap (Gaode Map)",
    {
        keywords: z.string().describe("Keywords to search for (e.g. 'restaurant', 'hotel')"),
        city: z.string().optional().describe("City name or code (optional)"),
    },
    async ({ keywords, city }) => {
        const result = await AmapService.searchPOI(keywords, city);
        return {
            content: [{ type: "text", text: result }],
        };
    }
);

mcpServer.tool(
    "amap_walking_direction",
    "Get walking directions between two locations using Amap",
    {
        origin: z.string().describe("Origin longitude,latitude (e.g. '116.481028,39.989643')"),
        destination: z.string().describe("Destination longitude,latitude"),
    },
    async ({ origin, destination }) => {
        const result = await AmapService.getWalkingDirection(origin, destination);
        return {
            content: [{ type: "text", text: result }],
        };
    }
);

mcpServer.tool(
    "amap_driving_direction",
    "Get driving directions between two locations using Amap",
    {
        origin: z.string().describe("Origin longitude,latitude"),
        destination: z.string().describe("Destination longitude,latitude"),
    },
    async ({ origin, destination }) => {
        const result = await AmapService.getDrivingDirection(origin, destination);
        return {
            content: [{ type: "text", text: result }],
        };
    }
);

mcpServer.tool(
    "amap_transit_direction",
    "Get public transit directions using Amap",
    {
        origin: z.string().describe("Origin longitude,latitude"),
        destination: z.string().describe("Destination longitude,latitude"),
        city: z.string().describe("City name or code"),
    },
    async ({ origin, destination, city }) => {
        const result = await AmapService.getTransitDirection(origin, destination, city);
        return {
            content: [{ type: "text", text: result }],
        };
    }
);

mcpServer.tool(
    "amap_bicycling_direction",
    "Get bicycling directions using Amap",
    {
        origin: z.string().describe("Origin longitude,latitude"),
        destination: z.string().describe("Destination longitude,latitude"),
    },
    async ({ origin, destination }) => {
        const result = await AmapService.getBicyclingDirection(origin, destination);
        return {
            content: [{ type: "text", text: result }],
        };
    }
);

    return mcpServer;
};

// Keep one instance for the legacy SSE endpoint.
export const mcpServer = createMcpServer();
