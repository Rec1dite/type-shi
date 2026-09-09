
//========== FizzBuzz ==========//

    type _3 =  [any, any, any];
    type _5 =  [any, any, any, any, any];

    // Via pattern matching we recursively strip off chunks of N items at a time
    type Div<T extends unknown[], N extends unknown[]>
        = T extends []
        ? true                              // 0 remainder => divisible
        : T extends [...infer Head, ...N]
            ? Div<Head, N>                    // match passed =>
            : false;                          // match failed => not divisible

    // Boolean AND
    type And<A extends boolean, B extends boolean> = [A, B] extends [true, true] ? true : false;

    // Simple match statement that returns the value of the first true condition in the list
    type Match<Cases extends ([boolean, any])[]>
        = Cases extends [ [infer Cond, infer Res], ...infer Rest extends [boolean, any][] ]
        ? Cond extends true
            ? Res
            : Match<Rest>
        : never;


    type FizzBuzz<
        N extends number,
        Res extends unknown[] = []
    > = [...Res]['length'] extends N
        ? Res                       // Res reached target length N => return
        : FizzBuzz<N, [             // Otherwise                   => continue iteration
            ...Res,
            Match<[
                [ And<Div<Res, _3>, Div<Res, _5>>, "FizzBuzz"    ],
                [ Div<Res, _3>,                    "Fizz"        ],
                [ Div<Res, _5>,                    "Buzz"        ],
                [ true,                            Res['length'] ],
            ]>
        ]>
    ;

//---------- Usage ----------//

type Res = FizzBuzz<30>;