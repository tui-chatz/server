import { existsSync, writeFileSync, readFileSync } from "node:fs";

export class GenericFileSystemRepository<T> {
    constructor(private filePath: string) {}

    private exists(): void {
        const exists = existsSync(this.filePath);
        if (!exists) {
            writeFileSync(this.filePath, JSON.stringify([]), 'utf-8');
            return;
        }

        if (readFileSync(this.filePath, 'utf-8').trim() === '') {
            writeFileSync(this.filePath, JSON.stringify([]), 'utf-8');
        }
    }

    get(): T[] {
        // Implementation for retrieving items from the file system
        this.exists();
        const data = readFileSync(this.filePath, 'utf-8');
        return JSON.parse(data) as T[];
    }
    
    save(item: T): void {
        // Implementation for saving an item to the file system
        this.exists();
        const data = this.get();
        const items = data;
        items.push(item);
        writeFileSync(this.filePath, JSON.stringify(items, null, 2), 'utf-8');
    }

    saveAll(items: T[]): void {
        this.exists();
        writeFileSync(this.filePath, JSON.stringify(items, null, 2), 'utf-8');
    }
}