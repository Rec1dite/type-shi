<script lang="ts">
	import Title from '$lib/components/title.svelte'
	import { codeToHtml } from 'shiki'
	import type { Row } from './rows'

	let { rows }: { rows: Row[] } = $props()

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
				class="grid grid-cols-[200px_240px_1fr] items-center border-b border-ctp-surface1 bg-ctp-base px-5 py-4 text-[23.4px] leading-[36.4px] font-medium uppercase tracking-wider text-ctp-overlay2"
			>
				<span>Construct</span>
				<span>TypeScript</span>
				<span>Example</span>
			</div>
			{#each rows as row, i}
				<div
					class="anim grid grid-cols-[200px_240px_1fr] items-center border-b border-ctp-surface1/60 px-5 py-4 last:border-b-0"
					style="--d: {0.2 + i * 0.06}s"
				>
					<span class="text-[26px] leading-[36.4px] font-medium {row.accent}">{row.construct}</span>
					<span class="text-[23.4px] leading-[36.4px] text-ctp-subtext0">{row.ts}</span>
					<span class="whitespace-pre-wrap font-mono text-[19.5px] leading-[26.8px] text-ctp-sky">
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
