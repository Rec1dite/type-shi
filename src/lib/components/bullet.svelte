<script lang="ts">
	import type { Snippet } from 'svelte'

	const dots: Record<string, string> = {
		peach: 'bg-ctp-peach',
		green: 'bg-ctp-green',
		red: 'bg-ctp-red',
		blue: 'bg-ctp-blue',
		sky: 'bg-ctp-sky',
		mauve: 'bg-ctp-mauve',
		lavender: 'bg-ctp-lavender',
		overlay: 'bg-ctp-overlay2'
	}

	let {
		tone = 'peach',
		sub = false,
		children
	}: {
		tone?: string
		sub?: boolean
		children: Snippet
	} = $props()
</script>

<li
	class="flex items-start gap-4 {sub
		? 'text-xl leading-snug text-ctp-subtext0'
		: 'text-2xl leading-snug text-ctp-text'}"
>
	<span
		class="mt-3 h-2.5 w-2.5 shrink-0 rounded-full {sub ? 'mt-2 h-2 w-2' : ''} {dots[tone] ?? 'bg-ctp-peach'}"
	></span>
	<span>{@render children()}</span>
</li>
