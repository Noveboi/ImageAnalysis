<script lang="ts">
    import { ImageManipulationContext, setState } from '$lib/State.svelte';
	import '../app.css';
	let { children } = $props();

	setState(new ImageManipulationContext())
</script>

{@render children()}
