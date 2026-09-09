<script lang="ts">
	import '../styles/app.css';
	import { initNotesTheme } from '$lib/notes-theme';

	initNotesTheme();

	let { children } = $props();
</script>

<svelte:head>
	<title>Type shi - Type theory, TypeScript &amp; Metaprogramming</title>
</svelte:head>

{@render children()}
