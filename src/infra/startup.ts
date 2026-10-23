import type { GenericCacheRepository } from '../repositories/generic-cache';
import type { GenericFileSystemRepository } from '../repositories/generic-file-system';
import type { TMessage } from '../types/message';

export namespace Startup {
    export function init(
        messageCacheRepository: GenericCacheRepository<TMessage>,
        messageFileSystemRepository: GenericFileSystemRepository<TMessage>
    ) {
        for (const message of messageFileSystemRepository.get()) {
            messageCacheRepository.save(message);
        }
    }
}