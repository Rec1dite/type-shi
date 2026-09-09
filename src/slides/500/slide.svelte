<script lang="ts">
	import Title from '$lib/components/title.svelte'

	const levels = [
		{
			name: 'Values',
			when: 'things that exist at runtime',
			code: '10, "hi"',
			card: 'border-ctp-green/40',
			text: 'text-ctp-green',
			chip: 'bg-ctp-green'
		},
		{
			name: 'Computed Values',
			when: 'things calculated at runtime',
			code: 'x + 69, "foo".toUpperCase()',
			card: 'border-ctp-teal/40',
			text: 'text-ctp-teal',
			chip: 'bg-ctp-teal'
		},
		{
			name: 'Types',
			when: 'sets of values',
			code: 'number, object, [string]',
			card: 'border-ctp-blue/40',
			text: 'text-ctp-blue',
			chip: 'bg-ctp-blue'
		},
		{
			name: 'Computed types',
			when: 'types calculated dynamically at compile time',
			code: 'T extends U ? X : Y',
			card: 'border-ctp-mauve/40',
			text: 'text-ctp-mauve',
			chip: 'bg-ctp-mauve'
		}
	]
</script>

<div class="flex h-full w-full flex-col justify-center px-14">
	<div class="anim">
		<Title>Type Theory in a Nutshell</Title>
	</div>

	<div class="mt-8 grid w-full grid-cols-2 gap-5">
		{#each levels as level, i}
			<div
				class="anim flex h-full flex-col rounded-xl border bg-ctp-mantle p-6 {level.card}"
				style="--d: {0.15 + i * 0.1}s"
			>
				<p class="flex items-center gap-3 text-2xl font-medium {level.text}">
					<span class="h-3 w-3 shrink-0 rounded-full {level.chip}"></span>
					{level.name}
				</p>
				<p class="mt-2 text-lg leading-snug text-ctp-overlay1">{level.when}</p>
				<p class="mt-4 rounded-lg bg-ctp-base px-3 py-2 font-mono text-xl text-ctp-sky">
					{level.code}
				</p>
			</div>
		{/each}
	</div>

	<div class="mt-8 flex w-full flex-col gap-4">
		<div
			class="anim flex flex-wrap items-baseline gap-x-4 gap-y-1 rounded-xl border border-ctp-peach/40 bg-ctp-mantle px-6 py-4"
			style="--d: 0.55s"
		>
			<span class="font-mono text-2xl text-ctp-peach">&quot;a&quot; | &quot;b&quot;</span>
			<span class="text-2xl text-ctp-overlay1">
				literal unions are
				<em class="font-medium not-italic text-ctp-peach">sum types</em>
			</span>
		</div>
		<div
			class="anim flex flex-wrap items-baseline gap-x-4 gap-y-1 rounded-xl border border-ctp-sky/40 bg-ctp-mantle px-6 py-4"
			style="--d: 0.68s"
		>
			<span class="font-mono text-2xl text-ctp-sky">&#123;a&#125; &amp; &#123;b&#125;</span>
			<span class="text-2xl text-ctp-overlay1">
				object intersections are
				<em class="font-medium not-italic text-ctp-sky">product types</em>
			</span>
		</div>
	</div>
</div>