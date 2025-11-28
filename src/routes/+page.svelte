<script lang="ts">
    import type { Attachment } from "svelte/attachments";
    import { toImageData, fromImageData, applyTransformList, transformPixels } from '$lib/utils';
    import { getState } from "$lib/State.svelte";
    import Slider from "$lib/Slider.svelte";
    import type { GrayscaleImage } from "$lib/types";
    import HistogramStats from "$lib/HistogramStats.svelte";
    import { Histogram } from "$lib/histogram";
    
    let image: HTMLImageElement | undefined = $state();
    let histogram: Histogram | undefined = $state();
    const context = getState();
    
    function handleImageLoad(event: Event) {
        const file = (event.target as HTMLInputElement).files?.[0];
        
        if (!file) return;

        const img = new Image();
        img.onload = () => image = img;
        img.src = URL.createObjectURL(file);
    }
    
    const canvasAttachment: Attachment<HTMLCanvasElement> = (canvas: HTMLCanvasElement) => {
        if (!image) {
            return;
        }

        canvas.width = image.width
        canvas.height = image.height

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(image, 0, 0)

        const imageData = ctx.getImageData(0, 0, image.width, image.height);
        const imageMatrix = fromImageData(imageData);
        manipulateImage(imageMatrix);

        ctx.putImageData(toImageData(imageMatrix, image.width, image.height), 0, 0);
    }

    function manipulateImage(image: GrayscaleImage): void {
        applyTransformList(image, [
            (f, _x, _y) => f + context.brighten,
            (f, _x, _y) => f * context.contrast,
            (f, _x, _y) => Math.round(f) // Utility to ensure the histogram receives discrete integer values.
        ]);

        const initHistogram = new Histogram(image);

        if (context.normalizedMinValue != initHistogram.minValue || context.normalizedMaxValue != initHistogram.maxValue) {
            const oMin = initHistogram.minValue;
            const oMax = initHistogram.maxValue;
            const nMin = context.normalizedMinValue || oMin;
            const nMax = context.normalizedMaxValue || oMax;

            const multiplier = (nMax - nMin) / (oMax - oMin);

            transformPixels(image, (o, _x, _y) => Math.round((o - oMin) * multiplier + nMin))
        } 

        histogram = new Histogram(image);
    }
</script>

<div class="flex flex-col lg:flex-row">
    <div class="tools p-4 border flex flex-col items-center gap-6">
        <input 
            class="border rounded p-2 font-bold"
            type="file" 
            accept="image/*" 
            onchange={handleImageLoad}
        />

        <div class="flex flex-col gap-4 items-center">
            <h1>Simple Point Operators</h1>
            <Slider bind:value={context.brighten} label='Darken/Brighten' min={-255} max={255}/>
            <Slider bind:value={context.contrast} label='Contrast' min={0} max={10} step='any'/>
        </div>
        <div class="flex flex-col gap-4 items-center">
            <h1>Histogram Normalization</h1>
            <Slider bind:value={context.normalizedMinValue} label='Lower Intensity Limit' min={0} max={255} />
            <Slider bind:value={context.normalizedMaxValue} label='Upper Intensity Limit' min={0} max={255} />
        </div>
    </div>

    <div class="w-full h-fit gap-8 p-8 flex flex-col text-center">
        <div class="image">
            {#if !image}
                <h1>Load an image to get started!</h1>
            {/if}
            <canvas width="0" height="0" {@attach canvasAttachment}></canvas>
        </div>
        <div class="histogram flex-1 max-h-128">
            <HistogramStats {histogram}/>
        </div>
    </div>

</div>

<style>
    canvas {
        max-height: 80vh;
    }

    h1 {
        font-size: 1.5rem;
        font-weight: 600;
    }
</style>