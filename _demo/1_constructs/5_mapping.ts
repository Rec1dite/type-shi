
//========== Mapped types ==========//

//---------- Basic map ----------//

    type UpperVals<T extends Record<string, any>> = {
        [K in keyof T]: Uppercase<T[K]>;
    };

    // Usage
    type Uppered = UpperVals<{ a: "apple"; b: "banana" }>;   // { a: "APPLE"; b: "BANANA" }


//----- Key remapping via `as` -----//
// The `as` clause lets you filter or rename keys while mapping.

    type Prefixed<T>
        = { [K in keyof T as `get${Capitalize<K & string>}`]: () => T[K]; };
//                       |------------ rename ------------|

    // Usage
    type PrefixedExample = Prefixed<{ name: string; age: number }>;


//----- Filtering keys -----//
// Return `never` from the `as` clause to omit a key

    type KeepStrings<T>
        = { [K in keyof T as T[K] extends string ? K : never]: T[K]; };
//                       |------------- filter ------------|

    // Usage
    type Filtered = KeepStrings<{ a: never; b: "gonna"; c: "give"; d: 2; e: "up" }>;
    type Filtered1 = KeepStrings<{ a: "the"; b: void; c: "looks"; d: 'back'; }>;