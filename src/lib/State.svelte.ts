import { getContext, setContext } from "svelte"
import type { GrayscaleImage } from "./types";

type Image = GrayscaleImage | undefined;

export class ImageManipulationContext {
    brighten: number = $state(0);
    contrast: number = $state(1);
    normalizedMinValue: number = $state(0);
    normalizedMaxValue: number = $state(255);
}

const KEY = 'Context'

export function setState(context: ImageManipulationContext) {
    setContext(KEY, context);
}

export function getState(): ImageManipulationContext {
    return getContext(KEY);
}