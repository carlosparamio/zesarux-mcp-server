# ZEsarUX MCP Server

MCP (Model Context Protocol) server to control the ZEsarUX emulator via ZRCP.

## Requirements

1. ZEsarUX running with ZRCP enabled:
   ```bash
   zesarux --enable-remoteprotocol
   ```
   By default it listens on port 10000.

## Installation

```bash
npm install
npm run build
```

## Configuration

Add to your MCP client configuration (e.g. `~/.kiro/mcp.json`):

```json
{
  "mcpServers": {
    "zesarux": {
      "command": "node",
      "args": ["/path/to/zesarux/mcp-server/dist/index.js"],
      "env": {
        "ZESARUX_HOST": "localhost",
        "ZESARUX_PORT": "10000"
      }
    }
  }
}
```

## Available Tools

| Tool | Description |
|------|-------------|
| `peek` | Read bytes from memory |
| `poke` | Write bytes to memory |
| `send_keys` | Type text into the emulator |
| `key_event` | Send individual key press/release |
| `set_io_ports` | Direct I/O port control (keyboard/joystick) |
| `smartload` | Load file (tape, snapshot, etc) |
| `get_registers` | Get CPU register values |
| `set_register` | Set a CPU register |
| `view_basic` | Get current BASIC listing |
| `reset` | Reset the machine |
| `disassemble` | Disassemble memory |
| `cpu_step` | Execute single instruction |
| `zrcp` | Run any ZRCP command |
| `get_machine` | Get current machine name |
| `set_machine` | Change emulated machine |
| `take_screenshot` | Capture screen as BMP image |
| `get_memory_zones` | List available memory zones |
| `set_memory_zone` | Set active memory zone |
| `set_breakpoint` | Set conditional breakpoint |
| `get_breakpoints` | List breakpoints |
| `enable_breakpoint` | Enable/disable a breakpoint |
| `toggle_breakpoints` | Enable/disable all breakpoints |

## Usage Examples

### Read memory
```
peek address=16384 length=6912  # Read entire screen
```

### POKE
```
poke address=23296 values="FF"  # POKE 23296,255
```

### Type BASIC
```
send_keys text="10 PRINT \"HELLO\"\n20 GOTO 10\nRUN\n"
```

### Joystick
The `set_io_ports` format is 9 hex bytes (18 characters):
- 8 bytes for keyboard rows
- 1 byte for joystick (bits: Fire, Up, Down, Left, Right)

```
set_io_ports ports="ffffffffffffffff01"  # Joystick right
```

### Raw ZRCP command
```
zrcp command="help"  # List all available commands
```

### Breakpoints
```
set_breakpoint index=0 condition="PC=4000H"  # Break at address 4000H
set_breakpoint index=1 condition="A=0 AND PC>=8000H"  # Complex condition
```
