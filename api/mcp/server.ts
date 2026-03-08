import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { z } from "zod";
import { config } from "../config/index.js";

// Create an MCP server
export const mcpServer = new McpServer({
    name: "DragonMCP",
    version: "1.0.0",
});

// -------------------------------------------------------------------------
// Payment Tools
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
// Travel Tools
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
    "search_public_transport",
    "Search for public transport (MTR, High Speed Rail)",
    {
        origin: z.string().describe("Start location"),
        destination: z.string().describe("End location"),
        type: z.enum(["mtr", "hsr"]).describe("Transport type"),
    },
    async ({ origin, destination, type }) => {
        console.log(`[Transport] ${type}: ${origin} -> ${destination}`);
        return {
            content: [{ type: "text", text: `Found ${type} routes from ${origin} to ${destination}` }],
        };
    }
);

// -------------------------------------------------------------------------
// E-commerce & Lifestyle Tools
// -------------------------------------------------------------------------

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

mcpServer.tool(
    "order_food",
    "Order food delivery",
    {
        restaurant: z.string().describe("Restaurant name"),
        items: z.array(z.string()).describe("List of items to order"),
        platform: z.enum(["meituan", "eleme"]).describe("Delivery platform"),
    },
    async ({ restaurant, items, platform }) => {
        console.log(`[Food] ${platform}: ${restaurant} - ${items.join(", ")}`);
        return {
            content: [{ type: "text", text: `Ordered ${items.join(", ")} from ${restaurant} via ${platform}` }],
        };
    }
);

// -------------------------------------------------------------------------
// Government Services Tools
// -------------------------------------------------------------------------

mcpServer.tool(
    "hk_eservices_query",
    "Query Hong Kong e-services",
    {
        service_type: z.string().describe("Type of government service"),
        query: z.string().describe("Query details"),
    },
    async ({ service_type, query }) => {
        console.log(`[HK Gov] ${service_type}: ${query}`);
        return {
            content: [{ type: "text", text: `Queried HK e-service: ${service_type}` }],
        };
    }
);
