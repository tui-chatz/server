import 'dotenv/config';
import { Server } from './src/infra/server';

import { MessageRepository } from './src/repositories/message';

const server = new Server(new MessageRepository());
server.run();