import net from "node:net";
import fs from "node:fs";
import type { TMessage } from "../types/message";

export class Server {
    private port: number = Number(process.env.TUI_CHAT_SERVER_PORT);
    private socket: net.Socket | null = null;

    public run(): void {
        const server = net.createServer((socket) => {
            this.socket = socket;
            this.recieveMessage();
            this.endConnection();
        });

        server.listen(this.port, () => {
            console.log(`Server listening on port ${this.port}`);
        });
    }

    private recieveMessage(): void {
        if (this.socket) {
            this.socket.on("data", (data: TMessage | string) => {
                data = data.toString() as string;
                data = JSON.parse(data) as TMessage;
                console.log(`Received: ${JSON.stringify(data, null, 2)}`);

                const path = process.cwd() + '/messages.json';

                // Valida se mensagem existe e não é vazia
                const messagesExists = fs.existsSync(path);
                if (!messagesExists) {
                    fs.writeFileSync(path, JSON.stringify([]));
                }

                const messages: TMessage[] = JSON.parse(fs.readFileSync(path, 'utf-8'));

                // Valida se a mensagem recebida é válida, ou se é uma mensagem de conexão
                if (
                    data.message === undefined
                    || data.message === ''
                    || data.action === 'connection'
                ) {
                    return;
                }
                messages.push(data);
                fs.writeFileSync(path, JSON.stringify(messages, null, 2));

                // Replicar mensagem para todos os clientes conectados
                if (this.socket) {
                    this.socket.write(JSON.stringify(messages));
                }
            });
            return;
        }
        console.log("No client connected");
    }

    private endConnection(): void {
        if (this.socket) {
            this.socket.on("end", () => {
                console.log("Client disconnected");
            });
            return;
        }
        console.log("No client connected");
    }

    public sendMessage(message: string): void {
        if (this.socket) {
            this.socket.write(message);
            return;
        }
        console.log("No client connected");
    }
}
