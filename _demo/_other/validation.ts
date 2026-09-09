//========== Type-level input validation patterns ==========//

//---------- Simple single-value validation ----------//

    type IsNumeric<T extends string> = T extends `${number}` ? T : never;
    function toNumber<T extends string>(value: IsNumeric<T>): number { return Number(value); }

    toNumber("-123.5E+10"); // OK
    toNumber("123"); // OK

    toNumber("abc"); // Type error: 'abc' is not numeric


//---------- Recursive generic validation ----------//
// Define a validator function which parses a type & returns a boolean
// checkUnique (x:xs) =
// | x `elem` xs -> false
// | otherwise x -> unq xs

    type Opts<T extends string[]> = T[number];
    type In<X extends string, T extends string[]> = Lowercase<X> extends Lowercase<Opts<T>> ? true : false;

    // Validation function
    // Note the isomorphism with the Haskell-like functional definition and the TS type-level definition
    type CheckUnique<T extends string[]>
        = T extends []
            ? true
            : T extends [infer X extends string, ...infer Xs extends string[]]
                ? In<X, Xs> extends true
                    ? false
                    : Unique<Xs>
                : true

    // Validation wrapper, calls validator
    type Unique<T extends string[]> = CheckUnique<T> extends false ? never : T;

    // Helper function captures input type and applies validation wrapper
    function createUniqueSet<const T extends string[]>(values: Unique<T>): T { return values; }


//========== HKT-powered generic validation patterns ==========//

    type CheckNumeric<X extends unknown> = X extends `${number}` ? true : (X extends number ? true : false);
    type CheckInteger<X extends unknown> = X extends `${bigint}` ? true : (X extends bigint ? true : false);
    type CheckCapital<X extends unknown> = X extends string ? (X extends Capitalize<X> ? true : false) : false;

    // HKT map
    type Checkers<X> = {
        "numeric": CheckNumeric<X>,
        "integer": CheckInteger<X>
        "capital": CheckCapital<X>
    };

    type All<T extends S[], Check extends keyof Checkers<S>, S = unknown>
        = T extends []                                               // base case
            ? true
            : T extends [infer X extends S, ...infer Xs extends S[]] // recursive case
                ? Checkers<X>[Check] extends true
                    ? All<Xs, Check, S>
                    : false
                : never
    ;

    type Any<T extends S[], Check extends keyof Checkers<S>, S = unknown>
        = T extends []                                               // base case
            ? false
            : T extends [infer X extends S, ...infer Xs extends S[]] // recursive case
                ? Checkers<X>[Check] extends true
                    ? true
                    : All<Xs, Check, S>
                : never
    ;

    function createNumericSet<const T extends unknown[]>(vals: All<T, "numeric"> extends true ? T : never): T { return vals; }
    function createIntegerSet<const T extends unknown[]>(vals: All<T, "integer"> extends true ? T : never): T { return vals; }
    function createCapitalSet<const T extends unknown[]>(vals: All<T, "capital"> extends true ? T : never): T { return vals; }


//---------- Usage ----------//

    type SomeNumeric = Any<["0", "a", 10], "numeric">; // true
    type AllCapital = All<["A", "B", "C"], "capital">; // true

    // Pass
    createNumericSet(["1", 2, "-3.5", 4]);
    createIntegerSet(["1", "2", "3", "-100"]);
    createCapitalSet(["ALL", "IN", "CAPS"]);

    // Fail
    createNumericSet(["1", "two", "3.5"]);
    createIntegerSet(["1", "2", "3.5"]);
    createCapitalSet(["NOT", "all", "CAPS"]);