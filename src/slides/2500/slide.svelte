<script lang="ts">
	import Title from '$lib/components/title.svelte'

	const libs = [
		{
			name: 'Effect.ts',
			desc: 'full TS ecosystem for error handling, concurrency, and resource management',
			url: 'https://effect.website',
			label: 'effect.website',
			accent: 'text-ctp-mauve'
		},
		{
			name: 'ts-pattern',
			desc: 'exhaustive, type-checked pattern matching',
			url: 'https://github.com/gvergnaud/ts-pattern',
			label: 'github.com/gvergnaud/ts-pattern',
			accent: 'text-ctp-blue'
		},
		{
			name: 'XState',
			desc: 'production-grade type-safe state machines',
			url: 'https://stately.ai',
			label: 'stately.ai',
			accent: 'text-ctp-green'
		},
		{
			name: 'better-result',
			desc: 'simple well-designed result type',
			url: 'https://better-result.dev',
			label: 'better-result.dev',
			accent: 'text-ctp-peach'
		},
		{
			name: '@sinclair/typebox',
			desc: 'schema management solution with strong TS integration',
			url: 'https://github.com/sinclairzx81/typebox',
			label: 'github.com/sinclairzx81/typebox',
			accent: 'text-ctp-sky'
		},
		{
			name: 'Type Challenges',
			desc: 'practice type-level programming',
			url: 'https://github.com/type-challenges/type-challenges',
			label: 'github.com/type-challenges/type-challenges',
			accent: 'text-ctp-lavender'
		}
	]
</script>

<div class="flex h-full w-full flex-col justify-center px-14">
	<div class="anim">
		<Title>Useful Tools &amp; Libraries</Title>
	</div>

	<div class="mt-6 w-full space-y-3">
		{#each libs as lib, i}
			<div
				class="anim flex items-center justify-between gap-6 rounded-xl border border-ctp-surface1 bg-ctp-mantle px-5 py-2.5"
				style="--d: {0.15 + i * 0.07}s"
			>
				<div class="flex min-w-0 flex-1 flex-col items-start text-left">
					<p class="w-fit text-left text-2xl font-medium {lib.accent}">{lib.name}</p>
					<p class="mt-0.5 text-left text-base text-ctp-overlay1">{lib.desc}</p>
				</div>
				<a
					href={lib.url}
					target="_blank"
					rel="noreferrer"
					class="shrink-0 text-lg italic text-ctp-sky underline decoration-ctp-sky/40 underline-offset-4 hover:text-ctp-sapphire"
				>
					{lib.label} ↗
				</a>
			</div>
		{/each}
	</div>

	<div class="anim mt-6 flex w-full items-center justify-center gap-2" style="--d: 0.6s">
		<svg
			viewBox="0 0 16 16"
			class="h-5 w-5 shrink-0 text-ctp-sky"
			fill="currentColor"
			aria-hidden="true"
		>
			<path
				d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"
			/>
		</svg>
		<span class="text-lg text-ctp-overlay1">Demo Source:</span>
		<a
			href="https://github.com/rec1dite/type-shi"
			target="_blank"
			rel="noreferrer"
			class="text-lg italic text-ctp-sky underline decoration-ctp-sky/40 underline-offset-4 hover:text-ctp-sapphire"
		>
			github.com/rec1dite/type-shi ↗
		</a>
	</div>
</div>