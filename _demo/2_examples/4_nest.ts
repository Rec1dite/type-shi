
//========== Nested Prop Extraction ==========//

    // Wrap key as string
    type ToKey<T extends keyof any> = T extends string | number ? `${T}` : never;

    // Determine all possible trails of keys through an object T, up to a maximum depth
    type PathOf<T extends object, MaxDepth = 5, Depth extends unknown[] = []> = 
        Depth['length'] extends MaxDepth ? never                                            // safety net:      max depth reached
            : ({ [K in keyof T]: T[K] extends object                                        // Object
                ? [ToKey<K>] | [ToKey<K>, ...PathOf<T[K], MaxDepth, [...Depth, unknown]>]  // recursive case:  object
                : [ToKey<K>]                                                                // base case:       primitive
            }[keyof T])
    ;

    // Find the value type at a given trail of keys in object T
    type ValueAt<T, Path extends (keyof any)[]> =
        Path extends []                            // base case: empty trail
            ? T
            : Path extends [infer K, ...infer Ks]  // recursive case
                ? K extends keyof T
                    ? Ks extends (keyof any)[]
                        ? ValueAt<T[K], Ks>
                        : never
                    : never
                : never
    ;

    // Get the value at a nested path in an object, returning undefined if any part of the path is invalid
    const getNestedValue = <
        T extends object,
        const P extends PathOf<T>
    >(obj: T | null, trail: P): ValueAt<T, P> => (
        trail.reduce<any>((acc, key) => acc?.[key], obj)
    );


//---------- Usage ----------//

    const nested = {
        a: {
            b: { c: 42, d: "hello" },
            e: true
        },
        f: { g: { h: 1234 } }
    } as const;

    const outA = getNestedValue(nested, ['a', 'b', 'c']);
    const outB = getNestedValue(nested, ['f', 'g', 'h']);
    const outC = getNestedValue(nested, ['f', 'g', 'i']);