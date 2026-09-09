
//========== Name-Val Utils ==========//

//---------- Type transforms ----------//

    export type NameValArr = ({ name: string, value: unknown })[];
    export type NameValObj = Record<string, unknown>;

    // Flatten type ({ name, value })[] to { [name]: value }
    export type FlatNameVal<T extends NameValArr> = { [K in T[number]['name']]?: Extract<T[number], { name: K }>['value'] };

    // Unflatten type { [name]: value } to ({ name, value })[]
    export type UnflatNameVal<T extends NameValObj> = ({ [K in keyof T]: { name: K, value: T[K] } }[keyof T])[];


//---------- Runtime transforms ----------//

    // Condense a ({ name, value })[] into { [name]: value }
    // If multiple pairs have the same name, the value of the last occurrence takes priority, but the types are disjunctioned
    export const condenseNameValArrToObj = <const T extends NameValArr>(nameVal: T): FlatNameVal<T> =>
        nameVal.reduce((prev, { name, value }) => ({ ...prev, [name]: value }), {} as FlatNameVal<T>)
    ;

    // Expand a { [name]: value } to ({ name, value })[]
    export const expandObjToNameValArr = <const T extends NameValObj>(obj: T): UnflatNameVal<T> =>
        Object.entries(obj).map(([name, value]) => ({ name, value } as { name: keyof T, value: T[keyof T] }))
    ;


//---------- Usage ----------//

    const condensedObj = condenseNameValArrToObj([
        { name: "firstName", value: "John" },
        { name: "lastName",  value: "Doe" },
        { name: "age",       value: 30 },
        { name: "age",       value: 31 },
    ]);

    const expandedArr = expandObjToNameValArr({
        firstName: "Jane",
        lastName: "Smith",
        age: 25,
    });
