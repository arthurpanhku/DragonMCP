from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
from reportlab.lib.utils import simpleSplit

TITLE = "DragonMCP — One-Page App Summary"

content = {
    "What it is": (
        "DragonMCP is a Model Context Protocol (MCP) server that connects AI agents "
        "to local-life services in Greater China and parts of Asia. "
        "It focuses on enabling real-world actions like transit queries, maps, and payments (mocked where needed)."
    ),
    "Who it’s for": (
        "AI agent developers and product teams building assistants that need access to local-life services "
        "across Greater China and neighboring Asian markets."
    ),
    "What it does": [
        "Exposes an MCP server with SSE transport for agent connections.",
        "Provides real-time MTR schedule queries for Hong Kong (Island & Tsuen Wan lines).",
        "Offers Amap (Gaode) POI search and walking/driving/transit/bicycling routing.",
        "Delivers Hong Kong Observatory current weather reports.",
        "Includes mock ride booking for Didi and Grab for demos.",
        "Includes mock payment flows for WeChat Pay, Alipay, and LINE Pay.",
        "Provides lifestyle/e-commerce mocks (Meituan food search, Taobao product search) and a regional transit aggregator.",
    ],
    "How it works": [
        "Client connects to Express server SSE endpoint at /mcp/sse; messages flow via /mcp/messages.",
        "MCP server (src/mcp/server.ts) registers tools and validates inputs with zod.",
        "Tool handlers call service modules under src/services/* for HK/CN/SG/JP/KR and aggregator logic.",
        "Service modules call external APIs (e.g., Amap, MTR, HK Observatory) or return mock data.",
        "Responses are returned as MCP text content back to the client session.",
    ],
    "How to run": [
        "Install Node.js 18+ and npm.",
        "Install deps: npm install",
        "Create env: cp .env.example .env (set AMAP_API_KEY; other keys as needed)",
        "Start dev server: npm run dev",
        "Connect MCP client to http://localhost:3000/mcp/sse",
    ],
}


def draw_wrapped_text(c, text, x, y, max_width, leading, font_name="Helvetica", font_size=10):
    c.setFont(font_name, font_size)
    lines = simpleSplit(text, font_name, font_size, max_width)
    for line in lines:
        c.drawString(x, y, line)
        y -= leading
    return y


def draw_bullets(c, items, x, y, max_width, leading, bullet_indent=10, font_size=10):
    c.setFont("Helvetica", font_size)
    for item in items:
        lines = simpleSplit(item, "Helvetica", font_size, max_width - bullet_indent)
        if not lines:
            continue
        c.drawString(x, y, "-")
        c.drawString(x + bullet_indent, y, lines[0])
        y -= leading
        for line in lines[1:]:
            c.drawString(x + bullet_indent, y, line)
            y -= leading
        y -= 2
    return y


def build_pdf(path):
    page_width, page_height = A4
    c = canvas.Canvas(path, pagesize=A4)

    margin_x = 18 * mm
    margin_top = 18 * mm
    margin_bottom = 16 * mm
    usable_width = page_width - margin_x * 2

    y = page_height - margin_top

    # Title
    c.setFont("Helvetica-Bold", 16)
    c.setFillColor(colors.black)
    c.drawString(margin_x, y, TITLE)
    y -= 18

    c.setStrokeColor(colors.black)
    c.setLineWidth(0.5)
    c.line(margin_x, y, margin_x + usable_width, y)
    y -= 12

    section_title_size = 11
    body_size = 10
    leading = 13

    for section, body in content.items():
        c.setFont("Helvetica-Bold", section_title_size)
        c.drawString(margin_x, y, section)
        y -= 12

        if isinstance(body, str):
            y = draw_wrapped_text(c, body, margin_x, y, usable_width, leading, font_size=body_size)
            y -= 6
        else:
            y = draw_bullets(c, body, margin_x, y, usable_width, leading, font_size=body_size)
            y -= 4

        # Safety stop if overflow (should not happen); leave marker
        if y < margin_bottom:
            c.setFont("Helvetica-Bold", 9)
            c.setFillColor(colors.red)
            c.drawString(margin_x, margin_bottom - 6, "Content overflowed the page. Please shorten sections.")
            break

    c.showPage()
    c.save()


if __name__ == "__main__":
    build_pdf("output/pdf/dragonmcp_summary.pdf")
