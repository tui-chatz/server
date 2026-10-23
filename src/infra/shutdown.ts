import type { GenericCacheRepository } from '../repositories/generic-cache';
import type { GenericFileSystemRepository } from '../repositories/generic-file-system';
import type { TMessage } from '../types/message';

export namespace Shutdown {
    export function listen(
        messageCacheRepository: GenericCacheRepository<TMessage>,
        messageFileSystemRepository: GenericFileSystemRepository<TMessage>
    ) {
        process.on('SIGINT', () => {
            Shutdown.backup(messageCacheRepository, messageFileSystemRepository);
            process.exit();
        });
        process.on('SIGTERM', () => {
            Shutdown.backup(messageCacheRepository, messageFileSystemRepository);
            process.exit();
        });
        process.on('uncaughtException', (err) => {
            console.error('Uncaught Exception:', err);
            Shutdown.backup(messageCacheRepository, messageFileSystemRepository);
            process.exit(1);
        });
        process.on('unhandledRejection', (reason, promise) => {
            console.error('Unhandled Rejection at:', promise, 'reason:', reason);
            Shutdown.backup(messageCacheRepository, messageFileSystemRepository);
            process.exit(1);
        });
    }

    export function backup(
        messageCacheRepository: GenericCacheRepository<TMessage>,
        messageFileSystemRepository: GenericFileSystemRepository<TMessage>
    ) {
        messageFileSystemRepository.saveAll(messageCacheRepository.get());
    }
}