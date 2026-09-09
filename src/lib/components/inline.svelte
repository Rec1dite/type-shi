<script lang="ts">
	let { text }: { text: string } = $props()

	const parts = text.split('`')
</script>

{#each parts as part, i}
	{#if i % 2 === 1}
		<code class="inline-code">{part}</code>
	{:else}
		{part}
	{/if}
{/each}
