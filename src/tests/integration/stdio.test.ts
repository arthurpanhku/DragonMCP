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
            expect(tools.some(({ name }) => name === 'taobao_search_product')).toBe(true);

            const result = CallToolResultSchema.parse(await client.callTool({
                name: 'taobao_search_product',
                arguments: { keyword: 'MCP' },
            }));
            const textContent = result.content.find((item) => item.type === 'text');

            expect(textContent).toMatchObject({
                type: 'text',
                text: expect.stringContaining('Taobao Results'),
            });
        } finally {
            await client.close();
        }
    }, 15_000);
});
