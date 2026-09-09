
//========== Loops ==========//
// Loop via recursion

    type TupLen<T extends unknown[], Acc extends 0[] = []> =
        T extends [] ? Acc["length"]
        : T extends [unknown, ...infer Rest] ? TupLen<Rest, [...Acc, 0]>
        : never;

    type StrLen<T extends string>
        = T extends `${string}${infer Rest}`
        ? [1, ...StrLen<Rest>]
        : [];


//---------- Usage ----------//

    type A = StrLen<"asdf">['length'];

    type Len4 = TupLen<['a', 'b', 'c', 'd']>; // 4
    type Len0 = TupLen<[]>;                   // 0 (base case)


    // Reverse a tuple
    //   reverse(t: unknown[], acc: unknown[] = []) {
    //      match (t) {
    //         [head, ...tail] => reverse(tail, [head, ...acc])
    //         otherwise       => acc
    //      }
    //   }
    type Reverse<T extends unknown[], Acc extends unknown[] = []> =
        T extends [infer Head, ...infer Tail]
            ? Reverse<Tail, [Head, ...Acc]>
            : Acc
        ;

    type Rev = Reverse<[1, 2, 3, 4, 5]>; // [5, 4, 3, 2, 1]