/**
 * This is a API server
 */

import express, {
  type Request,
  type Response,
  type NextFunction,
} from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { randomUUID } from 'node:crypto';
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js';
import { createMcpServer, mcpServer } from './mcp/server.js';

// load env
dotenv.config({ quiet: true });

const app: express.Application = express();

app.use(cors());
// Note: We need raw body for some MCP interactions potentially, but JSON is usually fine.
// SSEServerTransport handlePostMessage expects the request to be readable or have a body.
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Store active transports
const transports = new Map<string, SSEServerTransport>();
const streamableTransports = new Map<string, StreamableHTTPServerTransport>();

/**
 * MCP Streamable HTTP Endpoint (recommended for current Codex clients)
 */
app.all('/mcp', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionId = req.headers['mcp-session-id'] as string | undefined;
    let transport: StreamableHTTPServerTransport;

    if (sessionId && streamableTransports.has(sessionId)) {
      transport = streamableTransports.get(sessionId)!;
    } else if (!sessionId && req.method === 'POST' && isInitializeRequest(req.body)) {
      transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        onsessioninitialized: (initializedSessionId) => {
          streamableTransports.set(initializedSessionId, transport);
        },
      });

      transport.onclose = () => {
        const initializedSessionId = transport.sessionId;
        if (initializedSessionId) {
          streamableTransports.delete(initializedSessionId);
        }
      };

      await createMcpServer().connect(transport);
    } else {
      res.status(400).json({
        jsonrpc: '2.0',
        error: {
          code: -32000,
          message: 'Bad Request: No valid MCP session ID provided',
        },
        id: null,
      });
      return;
    }

    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    next(error);
  }
});

/**
 * MCP SSE Endpoint
 */
app.get('/mcp/sse', async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('New MCP connection request');

    // SSEServerTransport creates the session ID and appends it to this endpoint.
    const transport = new SSEServerTransport('/mcp/messages', res);
    const sessionId = transport.sessionId;

    transports.set(sessionId, transport);

    transport.onclose = () => {
      console.log(`MCP connection closed: ${sessionId}`);
      transports.delete(sessionId);
    };

    await mcpServer.connect(transport);
  } catch (error) {
    next(error);
  }
});

/**
 * MCP Messages Endpoint
 */
app.post('/mcp/messages', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionId = req.query.sessionId as string;

    if (!sessionId) {
      res.status(400).send('Missing sessionId');
      return;
    }

    const transport = transports.get(sessionId);

    if (!transport) {
      res.status(404).send('Session not found');
      return;
    }

    await transport.handlePostMessage(req, res, req.body);
  } catch (error) {
    next(error);
  }
});

/**
 * health
 */
app.use(
  '/api/health',
  (req: Request, res: Response, next: NextFunction): void => {
    res.status(200).json({
      success: true,
      message: 'ok',
    });
  },
);

/**
 * error handler middleware
 */
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    error: 'Server internal error',
  });
});

/**
 * 404 handler
 */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'API not found',
  });
});

export default app;
