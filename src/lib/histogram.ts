import type { GrayscaleImage } from "./types";

/**
 * The intensity values of an image.
 */
export class Histogram {
    public bins: number[];
    public cdf: number[];
    public static readonly labels: number[] = Array.from({ length: 256 }, (_, i) => i);
    
    public minValue: number = 256;
    public maxValue: number = -1;
    public image: GrayscaleImage;

    constructor(image: GrayscaleImage) {
        // Initialize array with 256 bins (0-255) all set to 0
        this.bins = new Array(256).fill(0);
        this.cdf = new Array(256);
        this.image = image;
        
        if (image.length === 0) {
            return;
        }
        
        const n = image.length;
        const m = image[0].length;
        
        // Single pass through the image
        for (let i = 0; i < n; i++) {
            const row = image[i];
            for (let j = 0; j < m; j++) {
                const pixelIntensity = row[j];
                this.bins[pixelIntensity]++;

                if (pixelIntensity < this.minValue) {
                    this.minValue = pixelIntensity;
                }

                if (pixelIntensity > this.maxValue) {
                    this.maxValue = pixelIntensity;
                }
            }
        }

        const imageSize = n * m;

        this.cdf = this.getCumulativeDistribution(imageSize);
    }

    public rescaleCdf(): number[] {
        const xMax = this.maxValue;
        const xMin = this.minValue;

        return this.cdf.map(y => y * (xMax - xMin) + xMin);
    }

    private getCumulativeDistribution(imageSize: number): number[] {
        const n = Histogram.labels.length;
        let accummulated = 0;

        const distribution = new Array(n);

        for (let i = 0; i < n; i++) {
            accummulated += this.bins[i];
            distribution[i] = accummulated / imageSize;
        }

        return distribution;
    }
}