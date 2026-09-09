
//========== Dep: Dependency injection util ==========//

// #region Type setup
/** Minimal AWS Lambda context shape exposed to handlers */
    type Context = {
        functionName?: string,
        awsRequestId?: string,
    };

    const logger = {
        error: (...args: unknown[]) => console.error(...args),
        info: (...args: unknown[]) => console.info(...args),
    };

    type DepName = string;
    type MaybePromise<T> = T | PromiseLike<T>;

// #region Events

    type LifecycleEvent = 'onStart' | 'onCall' | 'onExec' | 'onReturn';
    type StateEvent = 'onStart' | 'onCall' | 'onExec';

    /**
     * Discriminated lifecycle result
     * 'success' enforces an object TState, so later events can override props
     * */
    type EventResult<TState extends object = Record<string, unknown>, TError = unknown> = (
        | {
            type: 'error',
            error: TError
        }
        | {
            type: 'success',
            state: TState
        }
        | { type: 'noop' }
    );

// #endregion

// #region Handlers

    /** Type-erased cold-start handler */
    type AnyStartHandler = () => MaybePromise<EventResult<any, any>>;
    /** Type-erased state-producing handler (onExec / onReturn) */
    type AnyStateHandler = (input: any) => MaybePromise<EventResult<any, any>>;
    /** Type-erased per-invocation handler that also receives the lambda event and context */
    type AnyCallHandler = (
        event: any,
        context: Context,
        input: any
    ) => MaybePromise<EventResult<any, any>>;

// #endregion

    /** Dep lifecycle handlers collection */
    type DepData<
        TStart extends AnyStartHandler = AnyStartHandler,
        TCall extends AnyCallHandler = AnyCallHandler,
        TExec extends AnyStateHandler = AnyStateHandler,
        TReturn extends AnyStateHandler = AnyStateHandler
    > = {
        onStart?: TStart,
        onCall?: TCall,
        onExec?: TExec,
        onReturn?: TReturn,
    };

    type AnyDepData = DepData<AnyStartHandler, AnyCallHandler, AnyStateHandler, AnyStateHandler>;
    type AnyDepMap = Record<string, any>;
    /** A dep resolver that merges its transitive dependencies plus itself into a dep map */
    type AnyDep = ((resolved: any) => Record<string, AnyDepData>) & {
        readonly [DEP_NAMES]?: readonly string[],
    };

    const DEP_NAMES = Symbol("dependencyNames");
    const dataDependencyNames = new WeakMap<object, readonly string[]>();

    /** Flattens an intersection into a single object type */
    type Flat<T> = { [K in keyof T]: T[K] };

    /** Recursively marks values readonly, leaving functions intact */
    type DeepReadonly<T> =
        T extends (...args: any[]) => any ? T
        : T extends readonly (infer U)[] ? readonly DeepReadonly<U>[]
        : T extends object ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
        : T;

    /** U's properties override T's, falling back to the other when either side is never */
    type Override<T, U> =
        [T] extends [never] ? U
        : [U] extends [never] ? T
        : Omit<T, keyof U> & U;

    /** Converts a union of object types into their intersection */
    type UnionToIntersection<U> =
        (U extends unknown ? (x: U) => void : never) extends
        (x: infer I) => void ? I : never;

    /** A resolver that flattens a dep and its dependencies into a name -> DepData map */
    type Dep<
        TName extends DepName,
        TData extends AnyDepData,
        TDeps extends AnyDepMap = {}
    > = (resolved: AnyDepMap) => Flat<Override<TDeps, { [K in TName]: TData }>>;

    /** Extracts the dep map produced by a Dep resolver */
    type DepMapOf<D> = D extends (resolved: any) => infer M ? Flat<M> : never;
    /** Flat, deduplicated merge of every dep's map in a union */
    type MergedDepMaps<D> = Flat<UnionToIntersection<DepMapOf<D>>>;

    /** Extracts the success state type from a handler's EventResult */
    type SuccessStateOf<R> = R extends unknown
        ? Awaited<R> extends {
            type: "success",
            state: infer S
        } ? S : never
        : never;

    /** The state a dep produces for a lifecycle event, or never if it lacks that handler */
    type StateOf<D, K extends StateEvent> =
        D extends { [P in K]?: infer H }
        ? NonNullable<H> extends (...args: any[]) => infer R
        ? SuccessStateOf<R>
        : never
        : never;

    /** A dep's onStart state overridden by its onCall state */
    type StartCallState<D> = Override<StateOf<D, "onStart">, StateOf<D, "onCall">>;

    /** A dep's onStart/onCall state overridden by its onExec state */
    type FullState<D> = Override<
        StartCallState<D>,
        StateOf<D, "onExec">
    >;

    /** Keyed map of dep name -> that event's state, omitting deps without the handler */
    type StateMap<M extends AnyDepMap, K extends StateEvent> = {
        [P in keyof M as[StateOf<M[P], K>] extends [never] ? never : P]:
        DeepReadonly<Flat<StateOf<M[P], K>>>;
    };

    /** Keyed map of dep name -> onStart state */
    type StartStateMap<M extends AnyDepMap> = StateMap<M, "onStart">;

    /** Keyed map of dep name -> merged onStart/onCall state */
    type StartCallStateMap<M extends AnyDepMap> = {
        [P in keyof M as[StartCallState<M[P]>] extends [never] ? never : P]:
        DeepReadonly<Flat<StartCallState<M[P]>>>;
    };

    /** Keyed map of dep name -> merged onStart/onCall/onExec state */
    type FullStateMap<M extends AnyDepMap> = {
        [P in keyof M as[FullState<M[P]>] extends [never] ? never : P]:
        DeepReadonly<Flat<FullState<M[P]>>>;
    };

    /** A state, or an empty object when the state is never */
    type StateOrEmpty<S> = [S] extends [never] ? Record<string, never> : DeepReadonly<Flat<S>>;

    /** Keyed map of dep name -> full state, as passed to inject()'s factory */
    type InjectStates<M extends AnyDepMap> = {
        [K in keyof M]: StateOrEmpty<FullState<M[K]>>
    };

    /** A dep's own entry in a handler's input map, omitted when its state is never */
    type SelfEntry<TName extends DepName, S> = [S] extends [never]
        ? {}
        : { [K in TName]: DeepReadonly<Flat<S>> };

    /** Lifecycle handlers with per-event state types specialised by dep name and dependency map */
    type LifecycleHandlers<
        TName extends DepName,
        M extends AnyDepMap,
        TStartState extends object,
        TCallState extends object,
        TExecState extends object,
        TReturnState extends object
    > = DepData<
        () => MaybePromise<EventResult<TStartState, any>>,
        (
            event: any,
            context: Context,
            input: Flat<Override<StartStateMap<M>, SelfEntry<TName, TStartState>>>
        ) => MaybePromise<EventResult<TCallState, any>>,
        (input: Flat<Override<StartCallStateMap<M>, SelfEntry<TName, Override<TStartState, TCallState>>>>) =>
            MaybePromise<EventResult<TExecState, any>>,
        (input: Flat<Override<FullStateMap<M>, SelfEntry<TName, Override<
            Override<TStartState, TCallState>,
            TExecState
        >>>>) =>
            MaybePromise<EventResult<TReturnState, any>>
    >;

    /** Immutable builder: add dependencies, then define the lifecycle handlers */
    interface DepBuilder<TName extends DepName, TMap extends AnyDepMap> {
        addDeps<const TD extends readonly AnyDep[]>(
            deps: TD
        ): DepBuilder<TName, Flat<Override<TMap, MergedDepMaps<TD[number]>>>>;
        define<
            TStartState extends object = never,
            TCallState extends object = never,
            TExecState extends object = never,
            TReturnState extends object = never
        >(
            handlers: LifecycleHandlers<TName, TMap, TStartState, TCallState, TExecState, TReturnState>
                | (() => LifecycleHandlers<TName, TMap, TStartState, TCallState, TExecState, TReturnState>)
        ): Dep<TName, LifecycleHandlers<TName, TMap, TStartState, TCallState, TExecState, TReturnState>, TMap>;
    }

    /** Type-erased dep builder used internally by createDep */
    type AnyBuilder = {
        addDeps: (deps: readonly AnyDep[]) => AnyBuilder,
        define: (handlers: AnyDepData | (() => AnyDepData)) => AnyDep,
    };

    /** Error response shape returned by a lambda handler */
    export type LambdaErrorResponse = {
        statusCode: number,
        headers: { "Content-Type": string },
        body: string,
    };

    /** A lambda handler: (event, context) -> result or error response */
    export type LambdaHandler<TEvent = unknown, TResult = unknown> = (
        event: TEvent,
        context: Context
    ) => Promise<TResult | LambdaErrorResponse>;

// #endregion

// #region Runtime utils

    export function createDep<const TName extends DepName>(name: TName): DepBuilder<TName, {}> {
        const makeBuilder = (deps: readonly AnyDep[]): AnyBuilder => ({
            addDeps: (moreDeps) => makeBuilder([...deps, ...moreDeps]),
            define: (handlersOrFactory) => {
                const data = typeof handlersOrFactory === "function"
                    ? handlersOrFactory()
                    : handlersOrFactory;
                const dependencyNames = [...new Set(deps.flatMap((dep) => dep[DEP_NAMES] ?? []))];

                dataDependencyNames.set(data, dependencyNames);

                const dependency: AnyDep = (resolved: AnyDepMap = {}) => {
                    const result = deps.reduce<AnyDepMap>(
                        (acc, childDep) => Object.assign(acc, childDep(acc)),
                        { ...resolved }
                    );
                    result[name] = data;
                    return result;
                };

                Object.defineProperty(dependency, DEP_NAMES, {
                    configurable: false,
                    enumerable: false,
                    value: [...dependencyNames, name],
                });

                return dependency;
            },
        });

        return makeBuilder([]) as unknown as DepBuilder<TName, {}>;
    }

    function isRecord(value: unknown): value is Record<string, unknown> {
        return typeof value === "object" && value !== null;
    }

    function serialiseError(error: unknown): Record<string, unknown> {
        if (error instanceof Error) {
            return {
                name: error.name,
                message: error.message,
                stack: error.stack,
            };
        }

        return { message: String(error) };
    }

    function errorResponse(error: unknown): LambdaErrorResponse {
        const statusCode = isRecord(error) && typeof error.statusCode === "number"
            ? error.statusCode
            : 500;
        const message = error instanceof Error ? error.message : String(error);

        return {
            statusCode,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message }),
        };
    }

    function mergeStateMaps(...maps: Record<string, object>[]): Record<string, object> {
        const names = new Set(maps.flatMap((map) => Object.keys(map)));

        return Object.fromEntries(
            [...names].map((name) => [
                name,
                Object.assign({}, ...maps.map((map) => map[name])),
            ])
        );
    }

    function selectStateMap(
        states: Record<string, object>,
        names: readonly string[]
    ): Record<string, object> {
        return Object.fromEntries(
            names
                .filter((name) => name in states)
                .map((name) => [name, states[name]])
        );
    }

    export function inject<
        TEvent = unknown,
        TResult = unknown,
        const TDeps extends readonly AnyDep[] = readonly AnyDep[]
    >(
        deps: TDeps,
        factory: (deps: InjectStates<MergedDepMaps<TDeps[number]>>) => MaybePromise<TResult>
    ): LambdaHandler<TEvent, TResult> {
        const resolved = deps.reduce<AnyDepMap>(
            (acc, dep) => Object.assign(acc, dep(acc)),
            {}
        );

        const runLifecycle = async (
            event: LifecycleEvent,
            input: unknown
        ): Promise<Record<string, object>> => {
            const executions = Object.entries(resolved)
                .filter(([, data]) => Boolean(data[event]))
                .map(async ([name, data]) => {
                    let result: EventResult<any, any>;

                    const dependencyNames = dataDependencyNames.get(data) ?? [];

                    if (event === "onStart") {
                        result = await data.onStart!();
                    }
                    else if (event === "onCall") {
                        const callInput = input as {
                            event: TEvent,
                            lambdaContext: Context,
                            input: unknown
                        };
                        result = await data.onCall!(
                            callInput.event,
                            callInput.lambdaContext,
                            selectStateMap(
                                callInput.input as Record<string, object>,
                                [...dependencyNames, name]
                            )
                        );
                    }
                    else {
                        const stateNames = event === "onExec"
                            ? [...dependencyNames, name]
                            : [...dependencyNames, name];
                        result = await data[event]!(
                            selectStateMap(input as Record<string, object>, stateNames)
                        );
                    }

                    if (result.type === "error") {
                        throw result.error;
                    }

                    if (result.type === "noop") {
                        return {
                            name,
                            state: undefined,
                        };
                    }

                    if (!isRecord(result.state)) {
                        throw new TypeError(`${name}.${event}: success state must be an object`);
                    }

                    return {
                        name,
                        state: result.state,
                    };
                });

            const settled = await Promise.allSettled(executions);
            const failures = settled.filter(
                (result): result is PromiseRejectedResult => result.status === "rejected"
            );

            for (const failure of failures) {
                logger.error(JSON.stringify({
                    event: "dependency-lifecycle-error",
                    lifecycleEvent: event,
                    error: serialiseError(failure.reason),
                }));
            }

            if (failures.length > 0) {
                throw failures[0].reason;
            }

            const states: Record<string, object> = {};

            for (const result of settled) {
                if (result.status === "fulfilled" && result.value.state !== undefined) {
                    states[result.value.name] = result.value.state;
                }
            }

            return states;
        };

        const coldStartStates = runLifecycle("onStart", undefined);
        void coldStartStates.catch(() => undefined);

        return async (event, context) => {
            let startStates: Record<string, object> = {};
            let callStates: Record<string, object> = {};
            let execStates: Record<string, object> = {};
            let output: TResult | undefined;
            let failure: unknown;

            try {
                startStates = await coldStartStates;
            }
            catch (error) {
                logger.error(JSON.stringify({
                    event: "lambda-cold-start-error",
                    functionName: context?.functionName,
                    requestId: context?.awsRequestId,
                    error: serialiseError(error),
                }));

                return errorResponse(error);
            }

            try {
                callStates = await runLifecycle("onCall", {
                    event,
                    lambdaContext: context,
                    input: startStates,
                });
                execStates = await runLifecycle(
                    "onExec",
                    mergeStateMaps(startStates, callStates)
                );

                const injected = mergeStateMaps(startStates, callStates, execStates);
                output = await factory(injected as InjectStates<MergedDepMaps<TDeps[number]>>);
            }
            catch (error) {
                failure = error;
                logger.error(JSON.stringify({
                    event: "lambda-handler-error",
                    functionName: context?.functionName,
                    requestId: context?.awsRequestId,
                    error: serialiseError(error),
                }));
            }

            try {
                await runLifecycle(
                    "onReturn",
                    mergeStateMaps(startStates, callStates, execStates)
                );
            }
            catch (error) {
                if (failure === undefined) {
                    failure = error;
                }

                logger.error(JSON.stringify({
                    event: "lambda-return-error",
                    functionName: context?.functionName,
                    requestId: context?.awsRequestId,
                    error: serialiseError(error),
                }));
            }

            if (failure !== undefined) {
                return errorResponse(failure);
            }

            return output as TResult;
        };
    }

    const randId = () => Math.random().toString(36).slice(2, 6);

// #endregion


//---------- Usage ----------//

    const CONFIG = createDep("config")
        .define({

            onStart: () => ({
                type: "success",
                state: {
                    dbUrl: "postgres://localhost/app",
                    logLevel: "info",
                    logTitle: "app"
                },
            }),

            onExec: ({ config }) => ({
                type: "success",
                state: { requestId: `req(${randId()})` },
            }),

        });

    const LOGGER = createDep("logger")
        .addDeps([CONFIG])
        .define(() => {
            let buffer: string[] = []; // closure shared across onStart / onExec / onReturn

            return {

                onStart: () => ({
                    type: "success",
                    state: {
                        prefix: "[app]"
                    },
                }),

                onExec: ({ config, logger }) => {
                    buffer = []; // fresh per request

                    return {
                        type: "success",
                        state: {
                            prefix: `${logger.prefix} [${config.logLevel}]`, // Override onStart "[app]"
                            log: (msg: string) => buffer.push(`${logger.prefix} ${msg}`),
                            getLogs: () => [...buffer],
                        },
                    };
                },

                onReturn: ({ logger }) => {
                    console.log("  [logger] flushed:", logger.getLogs());
                    return { type: "success", state: {} };
                },

            };
        });

    const DB = createDep("db")
        .addDeps([CONFIG])
        .define(() => {
            let pool: { url: string } | null = null;

            return {

                onStart: () => {
                    pool = { url: "postgres://localhost/app" };
                    return { type: "success", state: { pool } };
                },

                onExec: ({ config, db }) => {
                    return {
                        type: "success",
                        state: {
                            query: (sql: string) => {
                                config.dbUrl;
                                db.pool.url;
                                return [{ id: 1, sql }];
                            },
                        },
                    };
                },

                onReturn: () => ({
                    type: "success",
                    state: { closed: true },
                }),

            };
        });


    // Inject dependencies to handler function
    const handleRequest = inject([DB, LOGGER], ({ config, logger, db }) => {

        logger.log(`handling ${config.requestId} → ${config.dbUrl} ${logger.prefix}`);

        const rows = db.query("SELECT * FROM users");

        logger.log(`fetched ${rows.length} row(s)`);

        return { ok: true, rows, requestId: config.requestId };

    });

    // onStart ran once at `inject()` time; onCall/onExec/onReturn run per invocation.
    await handleRequest({}, {});
    await handleRequest({}, {});
    // #endregion