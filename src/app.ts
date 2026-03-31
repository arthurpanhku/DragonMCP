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
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { mcpServer } from './mcp/server.js';
import { v4 as uuidv4 } from 'uuid';

// load env
dotenv.config();

const app: express.Application = express();

app.use(cors());
// Note: We need raw body for some MCP interactions potentially, but JSON is usually fine.
// SSEServerTransport handlePostMessage expects the request to be readable or have a body.
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Store active transports
const transports = new Map<string, SSEServerTransport>();

/**
 * MCP SSE Endpoint
 */
app.get('/mcp/sse', async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('New MCP connection request');

    const sessionId = uuidv4();

    // The client will send messages to this endpoint
    // We append the sessionId to ensure we route to the correct transport
    const messageEndpoint = `/mcp/messages?sessionId=${sessionId}`;

    const transport = new SSEServerTransport(messageEndpoint, res);

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

    await transport.handlePostMessage(req, res);
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
