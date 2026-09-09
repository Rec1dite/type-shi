<script lang="ts">
	import Title from '$lib/components/title.svelte'
	import { codeToHtml } from 'shiki'

	const rows = [
		{
			construct: 'Evaluation',
			ts: 'Compiler type instantiation',
			ex: 'type Greeting = Greet<"world">',
			accent: 'text-ctp-peach'
		},
		{
			construct: 'Variables',
			ts: 'Generic parameters',
			ex: 'type Greet<N extends string> = `Hello, ${N}!`',
			accent: 'text-ctp-yellow'
		},
		{
			construct: 'Branching',
			ts: 'Conditional types',
			ex: 'type IsString<T> = T extends string ? true : false',
			accent: 'text-ctp-mauve'
		},
		{
			construct: 'Loops',
			ts: 'Recursive conditional types',
			ex: 'type StrLen<T extends string> = T extends `${string}${infer R}`\n  ? [1, ...StrLen<R>] : []',
			accent: 'text-ctp-green'
		},
		{
			construct: 'Pattern matching',
			ts: 'extends + infer',
			ex: 'type Head<T extends unknown[]> = T extends [infer X, ...unknown[]] ? X : never',
			accent: 'text-ctp-blue'
		},
		{
			construct: 'Map',
			ts: 'Mapped types',
			ex: 'type UpperVals<T extends Record<string, string>> = { [K in keyof T]: Uppercase<T[K]> }',
			accent: 'text-ctp-sky'
		},
		{
			construct: 'Algebraic data types',
			ts: 'Unions & Intersections',
			ex: 'type OnlyStrings = ExtractStrings<"a" | 1 | "b" | boolean>',
			accent: 'text-ctp-teal'
		},
		{
			construct: 'Functions',
			ts: 'Generic type aliases (HKT)',
			ex: 'type Caps = ArrMap<"toUpper", MyStrings>',
			accent: 'text-ctp-red'
		}
	]

	let ready = $state(false)
	const highlighted = $state<Record<string, string>>({})

	async function highlightAll() {
		await Promise.all(
			rows.map(async (row) => {
				const html = await codeToHtml(row.ex, { lang: 'ts', theme: 'catppuccin-mocha' })
				highlighted[row.construct] = html.match(/<code>([\s\S]*)<\/code>/)?.[1] ?? html
			})
		)
		ready = true
	}

	highlightAll()
</script>

<div class="flex h-full w-full flex-col justify-center px-14">
	<div class="anim">
		<Title>TypeScript is Turing Complete</Title>
	</div>

	<div class="anim mt-6 w-full" style="--d: 0.12s">
		<div class="w-full overflow-hidden rounded-xl border border-ctp-surface1 bg-ctp-mantle">
			<div
				class="grid grid-cols-[190px_240px_1fr] items-center border-b border-ctp-surface1 bg-ctp-base px-5 py-3.5 text-lg font-medium uppercase tracking-wider text-ctp-overlay2"
			>
				<span>Construct</span>
				<span>TypeScript</span>
				<span>Example</span>
			</div>
			{#each rows as row, i}
				<div
					class="anim grid grid-cols-[190px_240px_1fr] items-center border-b border-ctp-surface1/60 px-5 py-2 last:border-b-0"
					style="--d: {0.2 + i * 0.06}s"
				>
					<span class="text-xl font-medium {row.accent}">{row.construct}</span>
					<span class="text-lg text-ctp-subtext0">{row.ts}</span>
					<span class="whitespace-pre-wrap font-mono text-[15px] leading-snug text-ctp-sky">
						{#if ready}
							{@html highlighted[row.construct]}
						{:else}
							{row.ex}
						{/if}
					</span>
				</div>
			{/each}
		</div>
	</div>
</div>