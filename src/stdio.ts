/**
 * Local MCP entry point using stdin/stdout as the transport.
 *
 * stdout is reserved for MCP JSON-RPC messages. Any diagnostic output from
 * this process or its services must be written to stderr.
 */
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createMcpServer } from './mcp/server.js';

const run = async (): Promise<void> => {
  const server = createMcpServer();
  const transport = new StdioServerTransport();

  await server.connect(transport);
};

run().catch((error: unknown) => {
  console.error('Failed to start DragonMCP stdio server:', error);
  process.exitCode = 1;
});
