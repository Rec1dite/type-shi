<script lang="ts">
	import type { Snippet } from 'svelte'

	let { children }: { children: Snippet } = $props()
</script>

<div class="flex w-full flex-wrap items-baseline gap-x-3" style="font-size: 2rem">
	<h1 class="font-medium tracking-tight text-ctp-accent" style="font-size: 1.25em">
		{@render children()}
	</h1>
</div>
