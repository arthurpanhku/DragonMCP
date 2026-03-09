import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { MTRService } from "../services/mtr/service.js";
import { AmapService } from "../services/travel/amap/service.js";
import { WeChatPayService } from "../services/payment/wechat/service.js";
import { AlipayService } from "../services/payment/alipay/service.js";
import { DidiService } from "../services/travel/didi/service.js";
import { MeituanService } from "../services/lifestyle/meituan/service.js";
import { TaobaoService } from "../services/ecommerce/taobao/service.js";

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

mcpServer.tool(
    "amap_search_poi",
    "Search for Places of Interest (POI) using Amap (Gaode Map)",
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
    "book_taxi_didi",
    "Estimate and book a taxi via Didi (Mock)",
    {
        originLat: z.number().describe("Origin Latitude"),
        originLng: z.number().describe("Origin Longitude"),
        destLat: z.number().describe("Destination Latitude"),
        destLng: z.number().describe("Destination Longitude"),
    },
    async ({ originLat, originLng, destLat, destLng }) => {
        const request = {
            origin: { lat: originLat, lng: originLng },
            destination: { lat: destLat, lng: destLng }
        };
        const estimate = await DidiService.estimatePrice(request);
        const orderId = await DidiService.requestRide(request);

        return {
            content: [{ type: "text", text: `Didi Ride Booked!\nOrder ID: ${orderId}\nEstimated Price: ${estimate.price} CNY\nDuration: ${estimate.duration} mins` }],
        };
    }
);

// -------------------------------------------------------------------------
// Payment Tools
// -------------------------------------------------------------------------

mcpServer.tool(
    "wechat_pay_create",
    "Initiate a WeChat Pay transaction (Mock)",
    {
        amount: z.number().describe("Amount to pay in CNY (converted to cents internally)"),
        description: z.string().describe("Description of the payment"),
        outTradeNo: z.string().optional().describe("Unique trade number"),
    },
    async ({ amount, description, outTradeNo }) => {
        const result = await WeChatPayService.createOrder({
            totalFee: Math.round(amount * 100),
            body: description,
            outTradeNo: outTradeNo || `order_${Date.now()}`,
        });
        return {
            content: [{ type: "text", text: `WeChat Pay Order Created.\nCode: ${result.return_code}\nMsg: ${result.return_msg}` }],
        };
    }
);

mcpServer.tool(
    "alipay_pay_create",
    "Initiate an Alipay transaction (Mock)",
    {
        amount: z.string().describe("Amount to pay in CNY"),
        subject: z.string().describe("Order subject/title"),
        outTradeNo: z.string().optional().describe("Unique trade number"),
    },
    async ({ amount, subject, outTradeNo }) => {
        const result = await AlipayService.createOrder({
            totalAmount: amount,
            subject: subject,
            outTradeNo: outTradeNo,
        });
        return {
            content: [{ type: "text", text: `Alipay Order Created.\nTrade No: ${result.outTradeNo}\nQR Code: ${result.qrCode}` }],
        };
    }
);

// -------------------------------------------------------------------------
// Lifestyle & E-commerce Tools
// -------------------------------------------------------------------------

mcpServer.tool(
    "meituan_search_food",
    "Search for food/restaurants on Meituan (Mock)",
    {
        keyword: z.string().describe("Food or restaurant name"),
        location: z.string().describe("Current location or address"),
    },
    async ({ keyword, location }) => {
        const results = await MeituanService.searchRestaurants(keyword, location);
        const text = results.map(r => `- ${r.name} (Rating: ${r.rating}, Min: ${r.minOrder})`).join('\n');
        return {
            content: [{ type: "text", text: `Meituan Results for "${keyword}":\n${text}` }],
        };
    }
);

mcpServer.tool(
    "taobao_search_product",
    "Search for products on Taobao (Mock)",
    {
        keyword: z.string().describe("Product keyword"),
    },
    async ({ keyword }) => {
        const results = await TaobaoService.searchProducts(keyword);
        const text = results.map(p => `- ${p.title} (Price: ¥${p.price}, Sales: ${p.sales})`).join('\n');
        return {
            content: [{ type: "text", text: `Taobao Results for "${keyword}":\n${text}` }],
        };
    }
);
