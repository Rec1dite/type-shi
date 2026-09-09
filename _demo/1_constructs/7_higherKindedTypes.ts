
//========== Higher-kinded Types ==========//

    // Earlier I referred to generic types as 'type constructors'
    // - This is not technically correct
    // - In type theory a true type constructor should itself exist as an operable type (without requiring instantiation)
    type MyTypeConstructor<T> = [T];


    // Contains the set of our 'simulated' HKTs
    //      Instead of different generic types with matching generics,
    //      we effectively build one type with 'shared' generics
    type Functions<Val> = {
        "toString": Val extends string | number ? `${Val}` : never,
        "toUpper":  Val extends string ? Uppercase<Val> : never,
        "greet":    Val extends string ? `Hello, ${Val}` : never,
    };


    // Build a mapping utility for applying the above functor operations
    type ArrMap<
        F extends keyof Functions<unknown>,
        Arr extends unknown[]
    > = { [I in keyof Arr]: Functions<Arr[I]>[F]; };


//---------- Usage ----------//

    type MyInput = [1.21, "gigawatts", "!"];

    type MyStrings = ArrMap<'toString', MyInput>;
    type MyCaps = ArrMap<'toUpper', MyStrings>;
    type MyGreeted = ArrMap<'greet', MyStrings>;