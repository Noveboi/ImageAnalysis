import type { GrayscaleImage, GrayscaleValue, PointOperator } from "./types";

/**
 * Converts a grayscale array to Canvas ImageData
 * @param arr - Grayscale array with shape [height, width]
 * @param width - Image width
 * @param height - Image height
 * @returns ImageData object
 */
export function toImageData(
  arr: GrayscaleImage, 
  width: number, 
  height: number
): ImageData {
  const imageData = new ImageData(width, height);
  
  let idx = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const gray = arr[y][x];
      imageData.data[idx++] = gray; // R
      imageData.data[idx++] = gray; // G
      imageData.data[idx++] = gray; // B
      imageData.data[idx++] = 255;  // A
    }
  }
  
  return imageData;
}

/**
 * Converts Canvas ImageData to a grayscale array using luminosity method
 * @param image - Canvas ImageData object
 * @returns Grayscale array with shape [height, width]
 */
export function fromImageData(image: ImageData): GrayscaleImage {
  const { width, height, data } = image;
  
  const arr: GrayscaleImage = [];
  
  for (let y = 0; y < height; y++) {
    const row: GrayscaleValue[] = [];
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      
      // Luminosity method: 0.299*R + 0.587*G + 0.114*B
      const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
      row.push(gray);
    }
    arr.push(row);
  }
  
  return arr;
}

/**
 * Applies a custom transformation function to each pixel
 * @param arr - Grayscale array with shape [height, width]
 * @param transformFn - Function that takes grayscale value and returns modified value
 * @returns Nothing, the image is transformed in-place.
 */
export function transformPixels(
  arr: GrayscaleImage, 
  transformFn: PointOperator
): void {
  const height = arr.length;
  const width = arr[0].length;
  
  for (let y = 0; y < height; y++) {
    const row = arr[y];
    for (let x = 0; x < width; x++) {
      const value = row[x];
      row[x] = transformFn(value, x, y);
    }
  }
}

export function applyTransformList(arr: GrayscaleImage, operators: readonly PointOperator[]): void {
  operators.forEach(operator => transformPixels(arr, operator));
}