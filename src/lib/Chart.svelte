<script lang="ts">
    import type { Attachment } from "svelte/attachments";
    import Chart from 'chart.js/auto';

    type Props = {
        type: 'bar' | 'line'
        label: string
        xLabels: unknown[],
        data: number[]
    };

    const props: Props = $props();
    let chart: Chart | undefined = $state();

    $effect(() => {
        if (!chart) return;

        chart.data.xLabels = props.xLabels;
        chart.data.datasets[0].data = props.data;
        chart.update();
    })

    const canvasChartAttachment: Attachment<HTMLCanvasElement> = (el: HTMLCanvasElement) => {
        if (!chart) {
            chart = new Chart(el, { 
                type: props.type,
                data: {
                    labels: props.xLabels,
                    datasets: [
                        {
                            label: props.label,
                            data: props.data
                        }
                    ]
                }
            })
        }
    }
</script>

<canvas {@attach canvasChartAttachment}></canvas>