import * as net from "node:net";

const ZRCP_PROMPT = "command>";

export class ZRCPClient {
  private socket: net.Socket | null = null;
  private buffer = "";
  private host: string;
  private port: number;

  constructor(host = "localhost", port = 10000) {
    this.host = host;
    this.port = port;
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket = net.createConnection({ host: this.host, port: this.port });
      this.socket.setEncoding("utf8");

      const onData = (data: string) => {
        this.buffer += data;
        if (this.buffer.includes(ZRCP_PROMPT)) {
          this.socket!.off("data", onData);
          this.buffer = "";
          resolve();
        }
      };

      this.socket.on("data", onData);
      this.socket.on("error", reject);
      this.socket.setTimeout(5000, () => reject(new Error("Connection timeout")));
    });
  }

  async send(command: string): Promise<string> {
    if (!this.socket) throw new Error("Not connected");

    return new Promise((resolve, reject) => {
      this.buffer = "";

      const onData = (data: string) => {
        this.buffer += data;
        if (this.buffer.includes(ZRCP_PROMPT)) {
          this.socket!.off("data", onData);
          const response = this.buffer.replace(ZRCP_PROMPT, "").trim();
          resolve(response);
        }
      };

      this.socket!.on("data", onData);
      this.socket!.write(command + "\n", (err) => {
        if (err) reject(err);
      });
    });
  }

  disconnect(): void {
    this.socket?.destroy();
    this.socket = null;
  }
}
