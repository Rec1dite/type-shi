<script lang="ts">
	import { Presentation, Slides } from '@animotion/core'
</script>

<Presentation
	options={{
		history: true,
		transition: 'slide',
		transitionSpeed: 'fast',
		controls: true,
		progress: true
	}}
	plugins={{
		notes: true,
	}}
>
	<Slides center={true} />
</Presentation>
