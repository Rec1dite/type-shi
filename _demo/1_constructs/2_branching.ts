
//========== Branching ==========//

    // Branch on *assignability*, instead of truthiness
    type IsString<T> = T extends string ? true : false;


//----- Evaluation -----//
// Each instantiation evaluates the condition fresh, like calling a function

    type R1 = IsString<"yarn">; // true  - "yarn" extends string, so take the `true` branch
    type R2 = IsString<42>;     // false - 42 does not extend string, so take the `false` branch


//----- Nesting -----//

    type IsStringOrNumber<T>
        = T extends string ? 'string'
        : T extends number ? 'number'
        : 'other';

    type S1 = IsStringOrNumber<"hello">; // "string"
    type S2 = IsStringOrNumber<123>;     // "number"
    type S3 = IsStringOrNumber<true>;    // "other"


//----- Distributivity -----//
// Filtering a union via conditional + `never`:

    type ExtractStrings<T> = T extends string ? T : never;

    type OnlyStrings = ExtractStrings<"a" | 1 | "b" | boolean>; // "a" | "b"