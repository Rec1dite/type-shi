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
			Design your own <em class="font-medium not-italic text-ctp-peach">tool / interface</em>
		</Bullet>
	</div>

	<div class="anim mt-8 w-full" style="--d: 0.2s">
		<Bullet tone="red">
			Not just <em class="font-medium not-italic text-ctp-red">single-use</em>
			implementations
		</Bullet>
	</div>

	<div class="anim mt-8 w-full" style="--d: 0.28s">
		<Bullet tone="green">
			General-purpose <em class="font-medium not-italic text-ctp-green">tools</em>
		</Bullet>
	</div>

	<div class="anim mt-8 w-full" style="--d: 0.36s">
		<Bullet tone="sky">
			Self-documenting - the types are their own docs
		</Bullet>
	</div>

	<div class="anim mt-10 w-full" style="--d: 0.5s">
		<p class="text-center text-2xl text-ctp-overlay1">
			A direct, typed interface for the user - the developer
		</p>
	</div>
</div>