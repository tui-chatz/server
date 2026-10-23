import 'dotenv/config';
import { Server } from './src/infra/server';
import NodeCache from 'node-cache';
import { GenericCacheRepository } from './src/repositories/generic-cache';
import { GenericFileSystemRepository } from './src/repositories/generic-file-system';
import type { TMessage } from './src/types/message';
import { Startup } from './src/infra/startup';
import { Shutdown } from './src/infra/shutdown';

const messageCacheRepository = new GenericCacheRepository<TMessage>(
    'messages',
    new NodeCache({ stdTTL: 0 })
);
const messageFileSystemRepository = new GenericFileSystemRepository<TMessage>(
    process.cwd() + '/messages.json'
);

Startup.init(messageCacheRepository, messageFileSystemRepository);
const server = new Server(messageCacheRepository);
server.run();
Shutdown.listen(messageCacheRepository, messageFileSystemRepository);