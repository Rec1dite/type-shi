<script lang="ts">
	import Title from '$lib/components/title.svelte'
	import Bullet from '$lib/components/bullet.svelte'
</script>

<div class="flex h-full w-full flex-col justify-center px-14">
	<div class="anim">
		<Title>The Appeal</Title>
	</div>

	<div class="anim mt-8 w-full" style="--d: 0.12s">
		<Bullet tone="peach">
			Contracts at <em class="font-medium not-italic text-ctp-peach">boundaries</em>
		</Bullet>
	</div>

	<div class="anim mt-8 w-full" style="--d: 0.22s">
		<Bullet tone="sky">
			Self-documenting
		</Bullet>
	</div>

	<div class="anim mt-8 w-full" style="--d: 0.32s">
		<Bullet tone="green">
			<em class="font-medium not-italic text-ctp-green">Exhaustive</em> checking
		</Bullet>
	</div>

	<div class="anim mt-8 w-full" style="--d: 0.42s">
		<Bullet tone="mauve">
			General purpose <em class="font-medium not-italic text-ctp-mauve">tool building</em>
		</Bullet>
	</div>

	<div class="anim mt-10 w-full" style="--d: 0.56s">
		<p class="text-center text-2xl text-ctp-overlay1">
			A direct, typed interface for the user - the developer
		</p>
	</div>
</div>