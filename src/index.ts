#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { ZRCPClient } from "./zrcp.js";

const HOST = process.env.ZESARUX_HOST || "localhost";
const PORT = parseInt(process.env.ZESARUX_PORT || "10000");

let client: ZRCPClient | null = null;

async function getClient(): Promise<ZRCPClient> {
  if (!client) {
    client = new ZRCPClient(HOST, PORT);
    await client.connect();
  }
  return client;
}

const server = new McpServer({
  name: "zesarux-mcp",
  version: "1.0.0",
});

// New help tool with specific instructions for the AI
server.tool(
  "help",
  "Get help and tips for using this MCP and the ZEsarUX emulator, especially for machines like Spectrum 48K.",
  {},
  async () => {
    return {
      content: [{
        type: "text",
        text: `ZEsarUX MCP Server Help & Tips:

1. General Usage:
   - All emulator operations are performed via the 'zrcp' tool.
   - IMPORTANT: Run 'zrcp(command: "help")' first to discover all available ZRCP commands (there are over 120).

2. Spectrum 48K & Keyword Machines:
   - Keyword Entry: These machines use single-key keywords. Do NOT type full words like "LOAD".
   - Common Key Mapping:
     * 'J' translates to LOAD
     * 'P' translates to PRINT
     * 'R' translates to RUN
   - Entering LOAD "":
     Use 'send-keys-string 100 J""' followed by 'send-keys-ascii 100 13'.
   - Enter Key: Use ASCII code 13 to simulate the Enter/Return key via 'send-keys-ascii'.
   - Screen Feedback: Commands like 'LOAD ""' clear the screen. If 'get-ocr' returns an empty string or nothing, it usually means the command was successful and the machine is now in a "listening" state (waiting for tape).

3. Maintenance:
   - Use 'reset-cpu' to return to the copyright screen.
   - Use 'get-current-machine' to verify which hardware is being emulated.`
      }]
    };
  }
);

server.tool(
  "zrcp",
  `Execute ZRCP command on ZEsarUX emulator. IMPORTANT: Run 'help' first to see all available commands. Use the MCP 'help' tool for machine-specific tips.`,
  { command: z.string().describe("ZRCP command to execute") },
  async ({ command }) => {
    const c = await getClient();
    const result = await c.send(command);
    return { content: [{ type: "text", text: result }] };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
