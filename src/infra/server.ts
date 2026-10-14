import net from "node:net";
import fs from "node:fs";
import type { TMessage } from "../types/message";
import type { MessageRepository } from "../repositories/message";

export class Server {
    private port: number = Number(process.env.TUI_CHAT_SERVER_PORT);
    private socket: net.Socket | null = null;
    private clients: net.Socket[] = [];

    constructor(private messageRepository: MessageRepository) {}

    public run(): void {
        const server = net.createServer((socket) => {
            this.socket = socket;
            this.clients.push(socket);
            this.recieveMessage();
            this.endConnection();
        });

        server.listen(this.port, () => {
            console.log(`Server listening on port ${this.port}`);
        });
    }

    private broadcastMessage(messages: TMessage[]): void {
        for (const client of this.clients) {
            client.write(JSON.stringify(messages));
        }
    }

    private recieveMessage(): void {
        if (this.socket) {
            this.socket.on("data", (data: TMessage | string) => {
                data = data.toString() as string;
                data = JSON.parse(data) as TMessage;

                // // const path = process.cwd() + '/messages.json';
// // 
                // // // Valida se mensagem existe e não é vazia
                // // const messagesExists = fs.existsSync(path);
                // // if (!messagesExists) {
                // //     fs.writeFileSync(path, JSON.stringify([]));
                // // }
// // 
                // // const messages: TMessage[] = JSON.parse(fs.readFileSync(path, 'utf-8'));
                
                // Valida se a mensagem recebida é válida, ou se é uma mensagem de conexão
                if (
                    data.message === undefined
                    || data.message === ''
                    || data.action === 'connection'
                ) {
                    // Replicar mensagem para todos os clientes conectados quando conectado
                    this.broadcastMessage(this.messageRepository.get());
                    return;
                }
                
                this.messageRepository.save(data);

                // Replicar mensagem para todos os clientes conectados
                this.broadcastMessage(this.messageRepository.get());
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
