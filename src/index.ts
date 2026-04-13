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
   - Run 'zrcp command="help"' to discover all available ZRCP commands (129 total).
   - Use 'get-ocr' to read text from the screen - this is the most effective way to see what's displayed.

2. ZEsarUX Menus:
   - ZEsarUX displays menus that block the emulator interface.
   - Use 'close-all-menus' to dismiss any open menu and return control to the emulator.
   - If the emulator seems unresponsive, try closing menus first.

3. Spectrum 48K - Keyword Mode (K mode):
   - In 48K mode, the default is K (keyword) mode - single keys produce BASIC keywords.
   - Do NOT type full words like "PRINT" or "LOAD". Use the keyword key instead.
   - Common keyword keys:
     * P = PRINT
     * J = LOAD
     * R = RUN
     * G = GOTO
     * K = LET
     * O = POKE
     * N = NEXT
     * F = FOR
     * I = IF
   - Example - type PRINT "HELLO":
     zrcp command="send-keys-string P\\"HELLO\\""
     zrcp command="send-keys-ascii 13"

4. Modifier Keys (Symbol Shift / Caps Shift):
   - Symbol Shift (SS) is needed for symbols and extended keywords.
   - Caps Shift (CS) is needed for cursor movement, DELETE, etc.
   - Format: send-keys-string uses ^ for Caps Shift and @ for Symbol Shift before the key.
   - Examples:
     * ^1 = EDIT (Caps Shift + 1)
     * ^0 = DELETE (Caps Shift + 0)
     * ^5 = cursor left, ^6 = cursor down, ^7 = cursor up, ^8 = cursor right
     * @P = " (Symbol Shift + P)
     * @L = = (Symbol Shift + L)
     * @Z = : (Symbol Shift + Z)
     * @8 = ( , @9 = )
   - Example - type 10 PRINT "HELLO" and press ENTER:
     zrcp command="send-keys-string 10P@PHELLO@P"
     zrcp command="send-keys-ascii 13"

5. Entering LOAD "":
   - zrcp command="send-keys-string J@P@P"
   - zrcp command="send-keys-ascii 13"
   - After LOAD "", the screen clears and waits for tape. Empty OCR is normal.

6. Useful Commands:
   - get-ocr: Read screen text
   - get-registers: CPU state
   - view-basic: Show BASIC listing
   - reset-cpu: Soft reset
   - hard-reset-cpu: Full reset
   - get-current-machine: Check emulated machine
   - smartload <file>: Load tape/snapshot/disk`
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
