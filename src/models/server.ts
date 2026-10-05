import net from "node:net";
import fs from "node:fs";

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
            this.socket.on("data", (data) => {
                data = data.toString();
                console.log(`Received: ${data}`);
                const path = process.cwd() + '/messages.json';
                console.log('debug: path >>', path);
                const messagesExists = fs.existsSync(path);
                console.log('debug: messagesExists >>', messagesExists);
                if (!messagesExists) {
                    fs.writeFileSync(path, JSON.stringify([]));
                }
                const messages = JSON.parse(fs.readFileSync(path, 'utf-8'));
                console.log('debug: messages >>', messages);
                if (
                    JSON.parse(data).message === undefined
                    || JSON.parse(data).message === ''
                    || JSON.parse(data).message === 'connected'
                ) {
                    return;
                }
                messages.push(data);
                console.log('debug: updated messages >>', messages);
                fs.writeFileSync(path, JSON.stringify(messages, null, 2));
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
