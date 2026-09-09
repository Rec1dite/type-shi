<script lang="ts">
	import type { Snippet } from 'svelte'
	import { Code, Transition, Action } from '@animotion/core'
	import Title from '$lib/components/title.svelte'
	import Bullet from '$lib/components/bullet.svelte'
	import Inline from '$lib/components/inline.svelte'

	let {
		pretxt = '',
		title,
		frames,
		bullets = [],
		note = '',
		compact = false,
		footer
	}: {
		pretxt?: string
		title: string
		frames: string[]
		bullets?: { tone?: string; text: string }[]
		note?: string
		compact?: boolean
		footer?: Snippet
	} = $props()

	let code: ReturnType<typeof Code>
	let steps = $state(0)

	const totalSteps = Math.max(frames.length - 1, bullets.length)
</script>

<div class="flex h-full w-full flex-col justify-center px-14">
	<Transition visible>
		<Title {pretxt}>{title}</Title>
	</Transition>

	<Transition visible class="mt-5 w-full">
		<Code
			bind:this={code}
			lang="ts"
			theme="catppuccin-mocha"
			code={frames[0]}
			options={{ duration: 600, stagger: 0.3, containerStyle: false }}
			class="{compact ? 'compact ' : ''}rounded-xl bg-ctp-mantle p-4"
		/>
	</Transition>

	<div class="mt-5 w-full space-y-2">
		{#each bullets as b, i}
			{#if steps >= i + 1}
				<Transition visible entry="fade-up" class="w-full">
					<Bullet tone={b.tone ?? 'blue'}><Inline text={b.text} /></Bullet>
				</Transition>
			{/if}
		{/each}
	</div>

	{#if note && steps >= totalSteps}
		<Transition visible entry="fade-up" class="mt-6 w-full">
			<div class="flex w-full items-center gap-4 rounded-xl border border-ctp-mauve/40 bg-ctp-mantle px-6 py-3">
				<span class="text-xl text-ctp-mauve">∴</span>
				<span class="text-xl text-ctp-overlay1"><Inline text={note} /></span>
			</div>
		</Transition>
	{/if}

	{#if footer}
		<div class="mt-6 w-full text-center">{@render footer()}</div>
	{/if}

	{#each Array.from({ length: totalSteps }) as _, s}
		{@const i = s + 1}
		<Action
			do={async () => {
				if (code && i < frames.length) await code.update`${frames[i]}`
				steps = i
			}}
			undo={async () => {
				if (code && i - 1 < frames.length) await code.update`${frames[i - 1]}`
				steps = i - 1
			}}
		/>
	{/each}
</div>
