import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { z } from "zod";
import { config } from "../config/index.js";
import { MTRService } from "../services/mtr/service.js";

// Create an MCP server
export const mcpServer = new McpServer({
    name: "DragonMCP",
    version: "1.0.0",
});

// -------------------------------------------------------------------------
// Travel Tools
// -------------------------------------------------------------------------

mcpServer.tool(
    "search_mtr_schedule",
    "Search for real-time MTR train schedule (Island Line & Tsuen Wan Line)",
    {
        from: z.string().describe("Starting station name (e.g., Admiralty, Central, Mong Kok)"),
        to: z.string().describe("Destination station name"),
    },
    async ({ from, to }) => {
        const result = await MTRService.getNextTrains(from, to);
        return {
            content: [{ type: "text", text: result }],
        };
    }
);

// -------------------------------------------------------------------------
// Payment Tools (Mock)
// -------------------------------------------------------------------------

mcpServer.tool(
    "wechat_pay",
    "Initiate a WeChat Pay transaction",
    {
        amount: z.number().describe("Amount to pay in CNY"),
        description: z.string().describe("Description of the payment"),
        type: z.enum(["mini_program", "utility"]).describe("Type of payment"),
    },
    async ({ amount, description, type }) => {
        // Placeholder implementation
        console.log(`[WeChat Pay] Amount: ${amount}, Desc: ${description}, Type: ${type}`);
        return {
            content: [{ type: "text", text: `WeChat Pay request initiated for ${amount} CNY (${type})` }],
        };
    }
);

mcpServer.tool(
    "alipay_pay",
    "Initiate an Alipay transaction",
    {
        amount: z.number().describe("Amount to pay in CNY"),
        description: z.string().describe("Description of the payment"),
        type: z.enum(["mini_program", "utility"]).describe("Type of payment"),
    },
    async ({ amount, description, type }) => {
        // Placeholder implementation
        console.log(`[Alipay] Amount: ${amount}, Desc: ${description}, Type: ${type}`);
        return {
            content: [{ type: "text", text: `Alipay request initiated for ${amount} CNY (${type})` }],
        };
    }
);

// -------------------------------------------------------------------------
// Other Tools (Mock)
// -------------------------------------------------------------------------

mcpServer.tool(
    "book_taxi",
    "Book a taxi via Didi or Meituan",
    {
        origin: z.string().describe("Pickup location"),
        destination: z.string().describe("Dropoff location"),
        provider: z.enum(["didi", "meituan"]).describe("Service provider"),
    },
    async ({ origin, destination, provider }) => {
        console.log(`[Taxi] ${provider}: ${origin} -> ${destination}`);
        return {
            content: [{ type: "text", text: `Taxi booked from ${origin} to ${destination} via ${provider}` }],
        };
    }
);

mcpServer.tool(
    "search_product",
    "Search for products on e-commerce platforms",
    {
        keyword: z.string().describe("Product keyword"),
        platform: z.enum(["taobao", "jd", "pinduoduo", "xianyu"]).describe("Platform to search"),
    },
    async ({ keyword, platform }) => {
        console.log(`[Shopping] ${platform}: ${keyword}`);
        return {
            content: [{ type: "text", text: `Found products for "${keyword}" on ${platform}` }],
        };
    }
);
