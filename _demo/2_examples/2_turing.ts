
//========== TS Turing Machine ==========//

namespace Turing {
	/**
	 * Type-level Turing Machine simulator.
	 *
	 * Entirely evaluated by the TypeScript type checker - no runtime code.
	 * Callers define an `AutomataLike` (transition table) and an initial
	 * `ConfigLike` (state + tape), then evaluate `Run<Automata, Config, Steps>`
	 * or `RunUnbound<Automata, Config>` and inspect the resulting config type
	 * via hover / `// ^?`.
	 *
	 * Tape is modeled as two stacks (`left`/`right`) plus `current` cell and a
	 * `default` blank symbol for infinite extension. Numbers/steps are Peano
	 * naturals encoded as nested `{ prev, isZero }` types.
	 */

	// ---------------------------------------------------------------------------
	// Primitives
	// ---------------------------------------------------------------------------

	/**
	 * String-encoded boolean. Used instead of `boolean`/`true`/`false` so
	 * conditional types can index via `{ "true": X, "false": Y }[cond]` without
	 * distributive-conditional quirks and so the value survives inside object
	 * types that are pattern-matched structurally.
	 */
	type StringBool = "true"|"false";

	/**
	 * Peano natural number. `isZero: "true"` is zero; otherwise `prev` points to
	 * the predecessor. `prev` is optional on `AnyNumber` so `_0` can omit it,
	 * but required on `PositiveNumber` to allow safe `Prev<T>`.
	 * Structure is a unary linked list: 0 = {isZero:"true"}, 1 = {prev:0,...}, etc.
	 */
	interface AnyNumber { prev?: any, isZero: StringBool };

	/**
	 * Non-zero Peano number. Guarantees `prev` exists and `isZero` is "false",
	 * so `Prev<T>` can extract the predecessor without `undefined`.
	 */
	interface PositiveNumber { prev: any, isZero: "false" };

	/**
	 * Extract the zero-flag from a Peano number.
	 * @template TNumber - any Peano number
	 */
	type IsZero<TNumber extends AnyNumber> = TNumber["isZero"];

	/**
	 * Successor. Wraps `TNumber` as the predecessor of a new number.
	 * E.g. `Next<_0>` is 1, `Next<_1>` is 2.
	 * @template TNumber - number to increment
	 */
	type Next<TNumber extends AnyNumber> = { prev: TNumber, isZero: "false" };

	/**
	 * Predecessor. Unwraps one `Next` layer. Only valid for `PositiveNumber`
	 * (enforced by constraint) so the result is well-defined.
	 * @template TNumber - strictly positive number
	 */
	type Prev<TNumber extends PositiveNumber> = TNumber["prev"];

	// ---------------------------------------------------------------------------
	// Arithmetic (also type-level, used to build step bounds)
	// ---------------------------------------------------------------------------

	/**
	 * Type-level addition: `T1 + T2`.
	 * Recurses on `T1`: if zero return `T2`, else `Next<Add<Prev<T1>, T2>>`.
	 * This is Peano addition; depth is O(T1).
	 * @template T1 - addend (recursion driver)
	 * @template T2 - addend (carried through)
	 */
	export type Add<T1 extends AnyNumber, T2> = { "true": T2, "false": Next<Add<Prev<T1>, T2>> }[IsZero<T1>];

	/**
	 * Type-level multiplication: `T1 * T2`.
	 * Delegates to tail-recursive accumulator `MultAcc<T1, T2, 0>`.
	 * @template T1 - multiplier (recursion driver)
	 * @template T2 - multiplicand
	 */
	export type Mult<T1 extends AnyNumber, T2 extends AnyNumber> = MultAcc<T1, T2, _0>;

	/**
	 * Accumulator helper for `Mult`. Invariant: result = `TAcc + T1*T2`.
	 * If `T1` is zero return `TAcc`, else recurse with `T1-1` and `TAcc+T2`.
	 * @template T1 - remaining multiplier
	 * @template T2 - multiplicand
	 * @template TAcc - accumulated sum
	 */
	type MultAcc<T1 extends AnyNumber, T2, TAcc extends AnyNumber> = 
			{ "true": TAcc, "false": MultAcc<Prev<T1>, T2, Add<TAcc, T2>> }[IsZero<T1>];

	// Peano numbers
	export type _0 = { isZero: "true" };
	export type _1 = Next<_0>;
	export type _2 = Next<_1>;
	export type _3 = Next<_2>;
	export type _4 = Next<_3>;
	export type _5 = Next<_4>;
	export type _6 = Next<_5>;
	export type _7 = Next<_6>;
	export type _8 = Next<_7>;
	export type _9 = Next<_8>;
	export type _10 = Next<_9>;
	export type _100 = Mult<_10, _10>;

	type Digits = { 0: _0, 1: _1, 2: _2, 3: _3, 4: _4, 5: _5, 6: _6, 7: _7, 8: _8, 9: _9 };
	type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

	// Convert a digit literal to its Peano type via `Digits` map
	type NumberToType<TNumber extends Digit> = Digits[TNumber]; // I don't know why typescript complains here.

	/**
	 * Build a two-digit decimal number `T2T1` (tens `T2`, ones `T1`) as Peano.
	 * Computes `10 * T2 + T1`. E.g. `Dec2<4,2>` is 42.
	 * @template T2 - tens digit
	 * @template T1 - ones digit
	 */
	type Dec2<T2 extends Digit, T1 extends Digit> = Add<Mult<_10, NumberToType<T2>>, NumberToType<T1>>;

	//---------- Tape / Stack ----------//

	/** Discriminated union for the tape stacks. Either empty or a linked list node. */
	export type Stack = EmptyStack | NonEmptyStack;

	/**
	 * Non-empty stack node (linked list). `prev` is the rest of the stack,
	 * `item` is the top symbol, `isEmpty` discriminant is "false".
	 */
	export interface NonEmptyStack { prev: any, isEmpty: "false", item: any };

	/** Empty stack sentinel. `isEmpty:"true"` is the discriminant. */
	export interface EmptyStack { isEmpty: "true" };

	/**
	 * Extract the emptiness flag from a stack.
	 * @template TStack - any stack
	 */
	type IsEmpty<TStack extends Stack> = TStack["isEmpty"];

	/**
	 * Push an item onto a stack. Returns a new `NonEmptyStack` node whose `prev`
	 * is the old stack.
	 * @template TItem - symbol to push
	 * @template TStack - stack to push onto
	 */
	type Push<TItem, TStack extends Stack> = { prev: TStack, item: TItem, isEmpty: "false" };

	/**
	 * Peek top of a non-empty stack. Caller must guarantee non-emptiness
	 * (usually guarded by `IsEmpty` dispatch).
	 * @template TStack - known non-empty stack
	 */
	type Peek<TStack extends NonEmptyStack> = TStack["item"];

	/**
	 * Pop top of a non-empty stack, returning the remaining stack.
	 * @template TStack - known non-empty stack
	 */
	type Pop<TStack extends NonEmptyStack> = TStack["prev"]; 

	/**
	 * Peek with fallback. If stack is empty return `TDefault` (the tape's blank
	 * symbol), else return `Peek<TStack>`. Models infinite blank tape.
	 * @template TStack - any stack
	 * @template TDefault - blank symbol to use when empty
	 */
	type PeekOrDefault<TStack extends Stack, TDefault> = {
		"true": TDefault,
		"false": Peek<TStack>
	}[IsEmpty<TStack>];

	/**
	 * Pop if not empty, else leave stack unchanged. Prevents popping an
	 * `EmptyStack` (which has no `prev`).
	 * @template TStack - any stack
	 */
	type PopIfNotEmpty<TStack extends Stack> = {
		"true": TStack,
		"false": Pop<TStack>
	}[IsEmpty<TStack>];

	/**
	 * Tape representation. Infinite tape is simulated by two stacks:
	 * `left` holds cells left of head (top = immediately left), `current` is
	 * under head, `right` holds cells right of head (top = immediately right),
	 * `default` is the blank symbol returned when a stack is empty (i.e. unwritten
	 * infinite region).
	 */
	type TapeLike = { left: Stack, current: any, right: Stack, default: string }

	/** Extract `left` stack from a tape. */
	type Left<TTape extends TapeLike> = TTape["left"];

	/** Extract `right` stack from a tape. */
	type Right<TTape extends TapeLike> = TTape["right"];

	/**
	 * Machine configuration: current `state`, current `tape`, and `halt` flag.
	 * `TConfig["halt"]=="true"` means machine has halted and `Run` stops.
	 * @template TAutomata - the transition table type (used to constrain `state`)
	 */
	type ConfigLike<TAutomata> = { state: keyof TAutomata, tape: TapeLike, halt: StringBool };

	/**
	 * Transition table (the program). Maps `state -> symbol -> Instruction`.
	 * Each state is a record keyed by tape symbols the machine may read.
	 * @example
	 * type Automata = {
	 *   "0": { "0": {write:"1", move:"r", next:"1", halt:"false"}, ... },
	 *   "1": { ... }
	 * }
	 */
	type AutomataLike = {
		[state: string]: {
			[symbol: string]: InstructionLike;
		}
	};

	/**
	 * Single transition instruction: what to write, which way to move head,
	 * which state to go to next, and whether to halt after this step.
	 * `move: "r"` = right, `"l"` = left, `"_"` = stay.
	 */
	type InstructionLike = { write: string, move: "r" | "_" | "l", next: string, halt: StringBool };

	/**
	 * Compute the next configuration after one TM step.
	 * Looks up `TConfig.state` + `TConfig.tape.current` in `TAutomata` to get the
	 * instruction, then delegates to `NextConfig1`.
	 * @template TAutomata - transition table
	 * @template TConfig - current configuration
	 */
	type NextConfig<TAutomata extends AutomataLike, TConfig extends ConfigLike<TAutomata>> 
		= NextConfig1<TConfig, TAutomata[TConfig["state"]][TConfig["tape"]["current"]]>;

	/**
	 * Intermediate helper that threads `TConfig` and the resolved instruction into
	 * `NextConfig2`. Exists to give TypeScript a place to infer/narrow the
	 * instruction type before destructuring tape/write/move.
	 * @template TConfig - current config
	 * @template TNextInstruction - instruction fetched by `NextConfig`
	 */
	type NextConfig1<TConfig extends ConfigLike<any>, TNextInstruction extends InstructionLike> 
		= NextConfig2<TConfig["tape"], TNextInstruction["write"], TNextInstruction>;

	/**
	 * Core tape-transition logic. Updates `state`/`halt` from the instruction and
	 * rebuilds `tape` based on `move`:
	 * - `"r"`: push `TWrite` onto `left`, `current` becomes `PeekOrDefault<right>`,
	 *          `right` is popped.
	 * - `"_"`: `current` becomes `TWrite`, stacks unchanged.
	 * - `"l"`: symmetric to `"r"` (push onto `right`, peek `left`).
	 * @template TTape - current tape
	 * @template TWrite - symbol to write
	 * @template TNextInstruction - full instruction (for `next`/`halt`/`move` dispatch)
	 */
	type NextConfig2<TTape, TWrite, TNextInstruction extends InstructionLike> = {
		state: TNextInstruction["next"],
		halt: TNextInstruction["halt"],
		tape: {
			"r": {
				left: Push<TWrite, Left<TTape>>,
				current: PeekOrDefault<Right<TTape>, TTape["default"]>,
				right: PopIfNotEmpty<Right<TTape>>,
				default: TTape["default"]
			},
			"_": {
				left: Left<TTape>,
				current: TWrite,
				right: Right<TTape>,
				default: TTape["default"]
			},
			"l": {
				left: PopIfNotEmpty<Left<TTape>>,
				current: PeekOrDefault<Left<TTape>, TTape["default"]>,
				right: Push<TWrite, Right<TTape>>,
				default: TTape["default"]
			}
		}[TNextInstruction["move"]]
	}

	/**
	 * Force TypeScript to eagerly expand/flatten an object type. Used inside `Run`
	 * as `Simplify<NextConfig<...>>` to avoid deeply nested lazy intersections
	 * that would hit recursion/instantiation limits and to keep hover display readable.
	 * @template T - type to flatten
	 */
	type Simplify<T> = { [TKey in keyof T]: T[TKey] }

	/**
	 * Bounded execution: run `TAutomata` from `TConfig` for at most `TSteps` steps.
	 * Recursion is `Run -> Simplify<NextConfig> -> Run` with `Prev<TSteps>`.
	 * Terminates when either `halt=="true"` (machine halted) or `IsZero<TSteps>`
	 * (step budget exhausted, returns current config as-is).
	 * Caller inspects the returned `ConfigLike` type for final tape/state.
	 * @template TAutomata - transition table
	 * @template TConfig - starting configuration (must have `halt` field)
	 * @template TSteps - Peano step budget (e.g. `_9`, `_100`, `Dec2<1,0>`)
	 */
	export type Run<TAutomata, TConfig extends { halt: StringBool }, TSteps extends AnyNumber> = {
		true: TConfig,
		false: { false: Run<TAutomata, Simplify<NextConfig<TAutomata, TConfig>>, Prev<TSteps>>, true: TConfig }[IsZero<TSteps>]
	}[TConfig["halt"]];

	/**
	 * Unbounded execution: run until `halt=="true"` with no step limit.
	 * No `TSteps` counter - will recurse until halt. If the machine never halts,
	 * the type checker will hit its recursion depth limit (error). Prefer `Run`
	 * for non-trivial exploration.
	 * @template TAutomata - transition table
	 * @template TConfig - starting configuration
	 */
	export type RunUnbound<TAutomata, TConfig extends { halt: StringBool }> = {
		true: TConfig,
		false: RunUnbound<TAutomata, Simplify<NextConfig<TAutomata, TConfig>>>
	}[TConfig["halt"]];
}

//---------- Usage 1: Simple ----------//

	// 2-state Busy Beaver. Halts after 6 steps with 4 ones
	type BusyBeaver2State = {
	"0": {
		"0": { write: "1", move: "r", next: "1", halt: "false" },
		"1": { write: "1", move: "l", next: "1", halt: "false" },
	},
	"1": {
		"0": { write: "1", move: "l", next: "0", halt: "false" },
		"1": { write: "1", move: "r", next: "0", halt: "true" },
	}
	};

	// Run the 2-state beaver for 9 steps (enough to halt)
	type BB2Result = Turing.Run<BusyBeaver2State, InitialConfig, Turing._9>;



//---------- Usage 2: Complex ---------//

	type InitialConfig = {
		state: "0",
		halt: "false",
		tape: {
			left: Turing.EmptyStack,
			current: "0",
			right: Turing.EmptyStack,
			default: "0"
		}
	};

	type BusyBeaver4State = {
		"0": {
			"0": { write: "1", move: "r", next: "1", halt: "false" },
			"1": { write: "1", move: "l", next: "1", halt: "false" },
		},
		"1": {
			"0": { write: "1", move: "l", next: "0", halt: "false" },
			"1": { write: "0", move: "l", next: "2", halt: "false" },
		},
		"2": {
			"0": { write: "1", move: "r", next: "2", halt: "true" },
			"1": { write: "1", move: "l", next: "3", halt: "false" },
		},
		"3": {
			"0": { write: "1", move: "r", next: "3", halt: "false" },
			"1": { write: "0", move: "r", next: "0", halt: "false" },
		},
	}

	// Run the 4-state beaver for 9 steps (bounded, not to halt)
	type Result_S9 = Turing.Run<BusyBeaver4State, InitialConfig, Turing.Mult<Turing._10, Turing._4>>;