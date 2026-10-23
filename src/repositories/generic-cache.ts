import type NodeCache from "node-cache";

export class GenericCacheRepository<T> {
    constructor(private key: string, private cache: NodeCache) {}

    private exists(): void {
        const exists = this.cache.has(this.key);
        if (!exists) {
            this.cache.set(this.key, []);
        }
    }

    get(): T[] {
        this.exists();
        const response = this.cache.get(this.key) as T[];
        return response;
    }

    save(item: T): void {
        this.exists();
        const items = this.get();
        items.push(item);
        this.cache.set(this.key, items);
    }
}