import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import app from '../../app.js';

describe('MCP Streamable HTTP transport', () => {
    let server: Server;
    let endpoint: URL;

    beforeAll(async () => {
        await new Promise<void>((resolve, reject) => {
            server = app.listen(0, '127.0.0.1', resolve);
            server.once('error', reject);
        });

        const address = server.address() as AddressInfo;
        endpoint = new URL(`http://127.0.0.1:${address.port}/mcp`);
    });

    afterAll(async () => {
        await new Promise<void>((resolve, reject) => {
            server.close((error) => error ? reject(error) : resolve());
        });
    });

    it('initializes a session and lists the registered tools', async () => {
        const transport = new StreamableHTTPClientTransport(endpoint);
        const client = new Client({
            name: 'dragonmcp-http-integration-test',
            version: '1.0.0',
        });

        try {
            await client.connect(transport);
            const { tools } = await client.listTools();

            expect(transport.sessionId).toBeDefined();
            expect(tools.some(({ name }) => name === 'system_run_selftest')).toBe(true);
        } finally {
            await client.close();
        }
    });
});
