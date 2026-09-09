
//========== Pattern Matching ==========//

//---------- Tuples/Arrays ----------//

    // head = ([x, ...rest]) => x
    // match a value against a pattern, bind its parts
    type Head<T extends unknown[]>
        = T extends [infer X, ...unknown[]] ? X : never;

    type Tail<T extends unknown[]>
        = T extends [unknown, ...infer Xs] ? Xs : [];


//---------- Usage ----------//

    type First = Head<["a", "b"]>;     // "a"
    type Rest = Tail<["a", "b", "c"]>; // ["b", "c"]

    type EmptyHead = Head<[]>;         // never - no element to extract


//---------- Objects ----------//

    type GetName<T> = T extends { name: infer N } ? N : never;

    type Name1  = GetName<{ name: "ada"; age: 30 }>; // "ada"
    type NoName = GetName<{ age: 30 }>;              // never


//---------- Strings ----------//

    type GetProtocol<T extends string> =
        T extends `${infer Proto}://${infer _Rest}` ? Proto : never;

    type Proto = GetProtocol<"https://example.com">; // "https"