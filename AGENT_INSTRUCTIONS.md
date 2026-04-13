# Instrucciones de instalación del MCP ZEsarUX

## Requisitos

- Node.js instalado
- Git instalado

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/carlosparamio/zesarux-mcp-server.git
cd zesarux-mcp-server
```

2. Instalar dependencias y compilar:
```bash
npm install
npm run build
```

3. Configurar el MCP en el cliente (Claude Desktop, Kiro, Cursor, VS Code, etc.) siguiendo las instrucciones del README.md. La ruta al servidor será `<directorio-donde-clonaste>/zesarux-mcp-server/dist/index.js`.

## Verificación

Reiniciar el cliente tras modificar la configuración. El tool `zrcp` estará disponible si ZEsarUX está corriendo con `--enable-remoteprotocol`.
