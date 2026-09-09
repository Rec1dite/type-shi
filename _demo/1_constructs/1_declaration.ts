
//========== Type declarations ==========//

//---------- Simple type declaration ----------//

    // const myConst = 10;
    type MyType = 10;

    // Types are immutable - Reassignment forbidden
    MyType = 20;


//---------- Parameterized type (Generic type constructor) ----------//

    // const greet = (name: string) => `Hello, ${name}`;
    type Greet<Name extends string> = `Hello, ${Name}!`;

    type Greeting = Greet<"world">;