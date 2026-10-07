import 'dotenv/config';
import { Server } from './src/infra/server';

const server = new Server();
server.run();