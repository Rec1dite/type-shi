
//========== Math ==========//

namespace Math {

    type Num = 1[];

    //----- Numbers -----//
    type _0 =  [];
    type _1 =  [1];
    type _2 =  [1, 1];
    type _3 =  [1, 1, 1];
    type _4 =  [1, 1, 1, 1];
    type _5 =  [1, 1, 1, 1, 1];
    type _6 =  [..._5, ..._1];
    type _7 =  [..._5, ..._2];
    type _8 =  [..._5, ..._3];
    type _9 =  [..._5, ..._4];
    type _10 = [..._5, ..._5];

    type ToConst<T extends Num> = T["length"];

    //----- Addition -----//
    type Add<A extends Num, B extends Num> = [...A, ...B];

    //----- Subtraction -----//
    type Sub<A extends Num, B extends Num>
        = A extends [...infer Delta, ...B]
        ? Delta
        : never;
    
    //----- Multiplication -----//
    type Mul<A extends Num, B extends Num, Res extends Num = []>
        = A extends [1, ...infer Rest extends Num]
        ? Mul<Rest, B, [...Res, ...B]>
        : Res;
    
    //----- Division -----//
    type Div<A extends Num, B extends Num, Res extends Num = []>
        = B extends []
        ? never
        : A extends [...B, ...infer Rest extends Num]
            ? Div<Rest, B, [...Res, 1]>
            : Res;
    
    //----- Modulo (remainder) -----//
    type Mod<A extends Num, B extends Num >
        = B extends []
        ? never
        : A extends [...B, ...infer Rest extends Num]
            ? Mod<Rest, B>
            : A;


    //---------- Usage ----------//

    type _16 = Add<_10, _6>;     type L_16 = ToConst<_16>;
    type _12 = Sub<_16, _4>;     type L_12 = ToConst<_12>;
    type _72 = Mul<_12, _6>;     type L_72 = ToConst<_72>;
    type _14 = Div<_72, _5>;     type L_14 = ToConst<_14>;
    type _02 = Mod<_72, _14>;    type L_02 = ToConst<_02>;
}