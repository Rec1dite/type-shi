
//========== Trickle: DAG branching logic util ==========//

//---------- Utils ----------//

    type Key = keyof any;

//---------- Types ----------//

    type Target<S> = (s: S) => S;                                   // Target returns final state
    type Branch<S, Keys extends Key> = (s: S) => Keys | [Keys, S];  // Branch may redirect flow and mutate state

    type TargetMap<S, Keys extends Key> = Partial<Record<Keys, Target<S>>>;
    type BranchMap<S, Keys extends Key> = Partial<Record<Keys, Branch<S, NoInfer<Keys>>>>;

//---------- Cycle detection ----------//

    type BranchTargets<F> = F extends (s: any) => infer R
        ? R extends [infer Next, any] ? Next : R
        : never;

    // A branch is "safe" iff every state it can return is a target or an already-safe branch
    // Targets are terminal, so safe branches are exactly those that cannot loop forever
    type IsSafe<B, K extends keyof B, S, T> = BranchTargets<B[K]> extends (S | T) ? true : false;
    type SafeKeys<B, S, T> = { [K in keyof B]: IsSafe<B, K, S, T> extends true ? K : never }[keyof B];

    // Least-fixpoint iteration:
    // - Grow the safe set until stable
    // - Any branch left over is part of a cycle
    // Kahn's topological sort, computed from the safe end rather than via indegree counts.
    type CheckCycles<B, T, S = never, N extends unknown[] = []>
        = N["length"] extends 100 ? "depth limit exceeded"
        : (S | SafeKeys<B, S, T>) extends S
            ? (Exclude<keyof B, S> extends never ? "ok" : `cycle: ${Exclude<keyof B, S> & string}`)
            : CheckCycles<B, T, S | SafeKeys<B, S, T>, [...N, unknown]>
    ;

    type ConsMap<S, Keys extends Key, B>
        = CheckCycles<B, Exclude<Keys, keyof B>> extends "ok"
            ? { targets: TargetMap<S, Keys>, branches: BranchMap<S, Keys> }
            : CheckCycles<B, Exclude<Keys, keyof B>>
    ;

    export function execute<const S, const Keys extends Key>(
        start: Keys,                                        // Point at which to begin execution
        state: S,                                           // State to begin with
        targets: Partial<Record<Keys, Target<S>>>,          // Target states
        branches: Partial<Record<Keys, Branch<S, Keys>>>    // Transition branches
    ): S {
        if (Object.hasOwn(targets, start)) return targets[start]!(state);
        else if (Object.hasOwn(branches, start)) {
            const res = branches[start]!(state);
            if (Array.isArray(res)) {
                const [next, newState] = res;
                return execute(next, newState, targets, branches);
            }
            else { return execute(res, state, targets, branches); }
        }
        else { throw Error(`Attempted transition to unknown state '${String(start)}'`); }
    }

//---------- Graph builder utility ----------//

    export function getConsMap<S>() {
        return <
            const Keys extends Key,
            const B extends BranchMap<S, Keys>
        >(
            ts: TargetMap<S, Keys>,
            bs: B & BranchMap<S, Keys>
        ): ConsMap<S, Keys, B> => ({ targets: ts, branches: bs }) as ConsMap<S, Keys, B>;
}

//---------- Usage ----------//

    // Declare state type that will be passed throughout
    type OrderState = {
        total: number,
        items: number,
        audit: string
    };

    // Define DAG of 'target' and 'branch' states
    const { targets, branches } = getConsMap<OrderState>()(
    {
        // State machine terminal states
        'APPROVE': s => ({ ...s, audit: s.audit + " -> approved" }),
        'REJECT':  s => ({ ...s, audit: s.audit + " -> rejected" }),
        'REVIEW':  s => ({ ...s, audit: s.audit + " -> manualReview (flagged for review)" }),
    },
    {
        // State machine transition states
        // - Uses Kahn's algorithm for cycle detection
        'checkout':        s => 'validateCart',
        'validateCart':    s => s.items === 0 ? 'REJECT' : 'checkInventory',
        'checkInventory':  s => s.items > 10  ? 'REVIEW' : 'applyCoupon',
        'applyCoupon':     s => ['checkFraud', { ...s, total: Math.max(0, s.total-20), audit: s.audit + " -> coupon:-$20" }],
        'checkFraud':      s => s.total > 500 ? 'REVIEW' : 'payment',
        'payment':         s => s.total <= 0  ? 'REJECT' : 'APPROVE',
        'expressCheckout': s => ['applyCoupon', { ...s, audit: s.audit + " -> express" }],
    });

    const res = execute("checkout", { total: 320, items: 3, audit: "checkout" }, targets, branches);
    console.log(res);