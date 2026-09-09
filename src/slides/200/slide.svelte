<script lang="ts">
	import Title from '$lib/components/title.svelte'
	import Bullet from '$lib/components/bullet.svelte'

	const spectrum = [
		{
			label: 'Runtime',
			desc: 'crash logs · repros · debugging',
			card: 'border-ctp-red/40 text-ctp-red',
			dot: 'bg-ctp-red'
		},
		{
			label: 'Compile time',
			desc: 'red squiggles in your editor',
			card: 'border-ctp-peach/40 text-ctp-peach',
			dot: 'bg-ctp-peach'
		},
		{
			label: 'Type level',
			desc: 'invalid states unrepresentable',
			card: 'border-ctp-green/40 text-ctp-green',
			dot: 'bg-ctp-green'
		}
	]
</script>

<div class="flex h-full w-full flex-col justify-center px-14">
	<div class="anim">
		<Title>Why Types?</Title>
	</div>

	<div class="anim mt-6 w-full" style="--d: 0.12s">
		<Bullet>The earlier a bug dies, the cheaper it is</Bullet>
	</div>

	<p class="anim mt-6 text-center text-sm uppercase tracking-widest text-ctp-overlay2" style="--d: 0.22s">
		bug cost spectrum
	</p>
	<div class="mt-3 grid grid-cols-3 gap-3">
		{#each spectrum as seg, i}
			<div
				class="anim rounded-xl border bg-ctp-mantle px-4 py-3 {seg.card}"
				style="--d: {0.3 + i * 0.09}s"
			>
				<p class="flex items-center gap-2 text-lg font-medium">
					<span class="h-2 w-2 rounded-full {seg.dot}"></span>
					{seg.label}
				</p>
				<p class="mt-1 text-sm leading-snug text-ctp-overlay1">{seg.desc}</p>
			</div>
		{/each}
	</div>

	<div class="anim mt-8 w-full" style="--d: 0.58s">
		<div
			class="flex flex-wrap items-baseline gap-x-4 gap-y-1 rounded-xl border border-ctp-mauve/40 bg-ctp-mantle px-6 py-4"
		>
			<span class="text-2xl font-medium text-ctp-mauve">Model checking</span>
			<span class="text-xl text-ctp-overlay1">
				the compiler as a proof-checker - a passing program is a proof
			</span>
		</div>
	</div>
</div>