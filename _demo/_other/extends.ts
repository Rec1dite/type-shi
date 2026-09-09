interface Animal {}

interface Dog extends Animal { bark(): void }

let v1: Animal = {} as Dog;
let v2: Dog = {} as Animal;

type V1 = Animal extends Dog ? true : false;
type V2 = Dog extends Animal ? true : false;

type Flat<T> = {[K in keyof T]: T[K]};

type V3 = (() => number) extends (() => number) ? true : false;

interface Logger<T> {
  logMethod(param: T): void; // Method syntax -> Bivariant
}

let animalLogger: Logger<Animal> = { logMethod: (a: Animal) => {} };
let dogLogger: Logger<Dog> = { logMethod: (d: Dog) => { d.bark(); } };

animalLogger = dogLogger; // ✅ OK in TypeScript (Bivariant loophole, unsafe at runtime!)
dogLogger = animalLogger; // ✅ OK (Standard contravariance)