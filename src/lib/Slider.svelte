<script lang="ts">
    type Props = {
        value: number
        step?: 'any' | number
        min?: number
        max?: number
        label?: string
    }

    let initialValue: number | undefined = $state();

    $effect(() => {
        if (initialValue === undefined) {
            initialValue = value
        }
    })  

    let { value = $bindable(), min, max, label, step}: Props = $props();

    function onclick() {
        if (initialValue !== undefined) {
            value = initialValue
        }
    }

</script>

<div class="flex py-2 px-8 gap-8 items-center border-2 rounded border-gray-400">
    <div class="flex flex-col items-center">
        <label class="font-bold w-64 text-center" for="slider">{label} ({value})</label>
        <input
            id="slider"
            type="range"
            {step}
            {min}
            {max}
            bind:value={value}/>
    </div>

    <button {onclick}>Reset</button>
</div>