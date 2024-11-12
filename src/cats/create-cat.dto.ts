// We can write the DTO using class and interface from the typescript, but it is recommended to use the class because they are preserved as real entities in the compiled JavaScript. On the other hand, since TypeScript interfaces are removed during the transpilation, Nest can't refer to them at runtime. This is important because features such as Pipes enable additional possibilities when they have access to the metatype of the variable at runtime

export class CreateCatDto {
  name: string;
  age: number;
  breed: string;
}
