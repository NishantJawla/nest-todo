import { Injectable } from '@nestjs/common';
import { Cat } from './cats.interface';

// The @Injectable() decorator attaches metadata, which declares that CatsService is a class that can be managed by the Nest IoC container.
// When the application is bootstrapped, every dependency must be resolved, and therefore every provider has to be instantiated. Similarly, when the application shuts down, each provider will be destroyed
@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [];

  create(cat: Cat) {
    console.log('cat is being inserted here', cat);
    this.cats.push(cat);
  }

  findAll(): Cat[] {
    return this.cats;
  }
}
