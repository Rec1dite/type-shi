
//========== Type Primitives ==========//

// Set analogy

//---------- Primitives ----------//
{
    const b: boolean = true;            // true | false
    const n: number = 42;               // -2 | -1.0 | 0 | 0.0005 | Infinity | NaN | ...
    const s: string = "Hi mom";         // "" | "ඞ" | "lorem ipsum dolor sit amet"

    const i: bigint = 3141592653n;
    const z: symbol = Symbol.iterator;
    const r: RegExp = /[\w\d-.]+@\w+.\w+/;

    const _nl: null      = null;
    const _ud: undefined = undefined;
}


//---------- Top types - any & unknown ----------//
{
    const a: any = { a: 1, b: { c: "hi" }}; // Anything goes - effectively disables type checking
    const u: unknown = { d: 2, e: {} };     // For assignment, anything goes; For usage, practice caution

    const v1 = a + 10;  // Succeeds - we don't care how 'a' is used
    const v2 = u + 10;  // Fails - we're uncertain about the contents of 'u', so practice caution
}


//---------- The bottom (_|_) type - never ----------//
// Signifies a type which contains no values whatsoever
// From a type-theoretic perspective, this indicates the return type of a function which never returns

    let impossible: never = 10; // Type '10' is not assignable to type 'never'.ts(2322)

    // No possible code path returns:
    // f :: () => never
    const f = (): never => {
        if (Math.random() > 0.5) {
            throw new Error();
        }
        else if (Math.random() > 0.5) {
            while (true) {}
        }
        else {
            for (;;) {}
        }

        console.log("Can't touch this"); // `Unreachable code detected. ts(7027)`
    }


//----- Special types -----//
{
    let func: () => void;

    class SomeClass {
        constructor(){
            let self: this;
        }
    }
}