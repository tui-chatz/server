import NodeCache from "node-cache";
import { GenericCacheRepository } from "./src/repositories/generic-cache";
import { GenericFileSystemRepository } from "./src/repositories/generic-file-system";

type Person = { name: string; age: number };
const genericCacheRepo = new GenericCacheRepository<Person>('persons', new NodeCache());
const genericFileSystemRepo = new GenericFileSystemRepository<Person>(process.cwd() + '/persons.json');

for (const person of genericFileSystemRepo.get()) {
    genericCacheRepo.save(person);
}


genericCacheRepo.save({ name: "John Doe", age: 30 });
genericCacheRepo.save({ name: "Millie Doe", age: 29 });
genericCacheRepo.save({ name: "Mike Doe", age: 28 });
const persons = genericCacheRepo.get();

genericFileSystemRepo.saveAll(persons);
console.log(persons);