// Type definitions for grayscale image arrays

export type GrayscaleValue = number;
export type GrayscaleImage = GrayscaleValue[][]; // [height, width]
export type PointOperator = (value: GrayscaleValue, x: number, y: number) => GrayscaleValue;
