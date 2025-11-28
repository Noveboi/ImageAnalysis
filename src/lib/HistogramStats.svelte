<script lang="ts">
    import Chart from "./Chart.svelte";
    import { Histogram } from "./histogram";

    const { histogram }: { histogram: Histogram | undefined } = $props();
</script>

{#if histogram}
    <div class="flex max-h-72">
        <Chart 
            type='bar' 
            label='Histogram' 
            data={histogram.bins} 
            xLabels={Histogram.labels}/>

        <Chart 
            type='line'
            label='CDF'
            data={histogram.cdf}
            xLabels={Histogram.labels}/>
    </div>
{/if}