import path from 'node:path';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { CallToolResultSchema } from '@modelcontextprotocol/sdk/types.js';

describe('MCP stdio transport', () => {
    it('initializes, lists tools, and calls a tool without corrupting stdout', async () => {
        const transport = new StdioClientTransport({
            command: process.execPath,
            args: [
                path.resolve('node_modules/tsx/dist/cli.mjs'),
                path.resolve('src/stdio.ts'),
            ],
            cwd: process.cwd(),
            stderr: 'pipe',
        });
        const client = new Client({
            name: 'dragonmcp-stdio-integration-test',
            version: '1.0.0',
        });

        try {
            await client.connect(transport);

            const { tools } = await client.listTools();
            expect(tools.some(({ name }) => name === 'search_mtr_schedule')).toBe(true);

            // An unknown station fails during local lookup, so this exercises the
            // transport end to end without touching the network.
            const result = CallToolResultSchema.parse(await client.callTool({
                name: 'search_mtr_schedule',
                arguments: { from: 'Atlantis', to: 'Central' },
            }));
            const textContent = result.content.find((item) => item.type === 'text');

            expect(textContent).toMatchObject({
                type: 'text',
                text: expect.stringContaining('Station not found: Atlantis'),
            });
        } finally {
            await client.close();
        }
    }, 15_000);
});
