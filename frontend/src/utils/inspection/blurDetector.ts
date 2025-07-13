/*
 * File: blurDetector.ts
 * Path: C:\\CFH\\frontend\\src\\utils\\inspection\\blurDetector.ts
 * Purpose: Utility function for blur detection using BlazeFace
 * Author: Cod1 Team
 * Crown Certified: Yes
 * Batch ID: Inspection-061325
 */

import * as tf from '@tensorflow/tfjs';
import * as blazeface from '@tensorflow-models/blazeface';

/**
 * Uses TensorFlow.js BlazeFace model to check if a face is detectable in the image.
 * @param file - image File object (typically from an <input type="file" />)
 * @returns Promise<boolean> - true if a face is detected (i.e., image is likely clear)
 */
export async function runBlurDetection(file: File): Promise<boolean> {
  const img = new Image();
  img.src = URL.createObjectURL(file);

  return new Promise((resolve) => {
    img.onload = async () => {
      try {
        const model = await blazeface.load();
        const predictions = await model.estimateFaces(img, false);
        resolve(predictions.length > 0);
      } catch (err) {
        console.error('Blur detection failed:', err);
        resolve(true); // Fallback: allow upload if detection fails
      }
    };
    img.onerror = () => resolve(false);
  });
}
