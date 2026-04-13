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

### Claude Desktop

Edit `~/.config/claude/claude_desktop_config.json` (Linux) or `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS):

```json
{
  "mcpServers": {
    "zesarux": {
      "command": "node",
      "args": ["/path/to/zesarux-mcp-server/dist/index.js"],
      "env": {
        "ZESARUX_HOST": "localhost",
        "ZESARUX_PORT": "10000"
      }
    }
  }
}
```

### Kiro

Edit `~/.kiro/mcp.json`:

```json
{
  "mcpServers": {
    "zesarux": {
      "command": "node",
      "args": ["/path/to/zesarux-mcp-server/dist/index.js"],
      "env": {
        "ZESARUX_HOST": "localhost",
        "ZESARUX_PORT": "10000"
      }
    }
  }
}
```

### Opencode

Edit `~/.config/opencode/config.json`:

```json
{
  "mcp_servers": {
    "zesarux": {
      "command": "node",
      "args": ["/path/to/zesarux-mcp-server/dist/index.js"],
      "env": {
        "ZESARUX_HOST": "localhost",
        "ZESARUX_PORT": "10000"
      }
    }
  }
}
```

### Gemini CLI

Global config at `~/.gemini/settings.json`:

```json
{
  "mcpServers": {
    "zesarux": {
      "command": "node",
      "args": ["/path/to/zesarux-mcp-server/dist/index.js"],
      "env": {
        "ZESARUX_HOST": "localhost",
        "ZESARUX_PORT": "10000"
      }
    }
  }
}
```

Project-local config at `.gemini/settings.json` in your project root (same format).

### VS Code (GitHub Copilot)

Create `.vscode/mcp.json` in your workspace:

```json
{
  "servers": {
    "zesarux": {
      "command": "node",
      "args": ["/path/to/zesarux-mcp-server/dist/index.js"],
      "env": {
        "ZESARUX_HOST": "localhost",
        "ZESARUX_PORT": "10000"
      }
    }
  }
}
```

### Cursor

Create `.cursor/mcp.json` in your project root:

```json
{
  "mcpServers": {
    "zesarux": {
      "command": "node",
      "args": ["/path/to/zesarux-mcp-server/dist/index.js"],
      "env": {
        "ZESARUX_HOST": "localhost",
        "ZESARUX_PORT": "10000"
      }
    }
  }
}
```

### LM Studio

Edit `mcp.json` in LM Studio's config directory (`~/.lmstudio/` on Linux/macOS, `%USERPROFILE%\.lmstudio\` on Windows):

```json
{
  "mcpServers": {
    "zesarux": {
      "command": "node",
      "args": ["/path/to/zesarux-mcp-server/dist/index.js"],
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
| `zrcp` | Run any ZRCP command |
| `help` | Get tips for using the emulator |

## Usage Examples

All operations use the `zrcp` tool with the appropriate command.

### Read memory
```
zrcp command="read-memory 16384 6912"   # Read screen memory
zrcp command="hexdump 16384 256"        # Hex + ASCII dump
```

### Write memory (POKE)
```
zrcp command="write-memory 23296 255"   # POKE 23296,255
```

### Type text / BASIC
```
zrcp command="send-keys-string \"10 PRINT \\\"HELLO\\\"\""
zrcp command="send-keys-ascii 13"       # ENTER key
```

### Keyboard / Joystick
```
zrcp command="set-ui-io-ports ffffffffffffffff01"  # Joystick right
zrcp command="send-keys-event z 1"      # Press 'z'
zrcp command="send-keys-event z 0"      # Release 'z'
```

### Load files
```
zrcp command="smartload /path/to/game.tap"
zrcp command="snapshot-load /path/to/snapshot.z80"
```

### CPU registers
```
zrcp command="get-registers"
zrcp command="set-register PC 32768"
```

### BASIC listing
```
zrcp command="view-basic"
```

### Reset
```
zrcp command="reset-cpu"
zrcp command="hard-reset-cpu"
```

### Disassemble
```
zrcp command="disassemble 32768 10"     # 10 instructions from address
```

### CPU stepping
```
zrcp command="enter-cpu-step"
zrcp command="cpu-step"
zrcp command="exit-cpu-step"
```

### Machine control
```
zrcp command="get-current-machine"
zrcp command="get-machines"
zrcp command="set-machine Spectrum 48k"
```

### Screenshots
```
zrcp command="save-screen /tmp/screen.scr"
```

### Memory zones
```
zrcp command="get-memory-zones"
zrcp command="set-memory-zone 0"
```

### Breakpoints
```
zrcp command="set-breakpoint 0 PC=4000H"
zrcp command="set-breakpoint 1 A=0 AND PC>=8000H"
zrcp command="get-breakpoints"
zrcp command="enable-breakpoint 0"
zrcp command="disable-breakpoint 0"
zrcp command="enable-breakpoints"
zrcp command="disable-breakpoints"
```

### Help
```
zrcp command="help"                     # List all commands
zrcp command="help read-memory"         # Help for specific command
```
