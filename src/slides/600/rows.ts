export type Row = {
	construct: string
	ts: string
	ex: string
	accent: string
}

export const rows: Row[] = [
	{
		construct: 'Primitives',
		ts: 'Built-in & literal types',
		ex: 'type Primitive = string | number | boolean',
		accent: 'text-ctp-peach'
	},
	{
		construct: 'Declaration',
		ts: 'Type aliases & generic parameters',
		ex: 'type Greet<Name extends string> = `Hello, ${Name}!`',
		accent: 'text-ctp-yellow'
	},
	{
		construct: 'Branching',
		ts: 'Conditional types',
		ex: 'type IsString<T> = T extends string ? true : false',
		accent: 'text-ctp-mauve'
	},
	{
		construct: 'Pattern Matching',
		ts: 'extends + infer',
		ex: 'type Head<T extends unknown[]> = T extends [infer X, ...unknown[]] ? X : never',
		accent: 'text-ctp-blue'
	},
	{
		construct: 'Loops',
		ts: 'Recursive conditional types',
		ex: 'type StrLen<T extends string> = T extends `${string}${infer R}`\n  ? [1, ...StrLen<R>] : []',
		accent: 'text-ctp-green'
	},
	{
		construct: 'Mapping',
		ts: 'Mapped types',
		ex: 'type UpperVals<T extends Record<string, any>> = { [K in keyof T]: Uppercase<T[K]> }',
		accent: 'text-ctp-sky'
	},
	{
		construct: 'Math',
		ts: 'Tuple-length arithmetic',
		ex: 'type Add<A extends 1[], B extends 1[]> = [...A, ...B]',
		accent: 'text-ctp-teal'
	},
	{
		construct: 'Functions',
		ts: 'Higher-kinded types (HKT)',
		ex: 'type MyCaps = ArrMap<"toUpper", MyStrings>',
		accent: 'text-ctp-red'
	}
]
