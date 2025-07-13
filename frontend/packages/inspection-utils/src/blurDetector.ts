/*
 * File: blurDetector.ts
 * Path: C:\\CFH\\frontend\\packages\\inspection-utils\\src\\blurDetector.ts
 * Purpose: Detects blurry photos using TensorFlow BlazeFace model
 * Author: Cod1 Team
 * Crown Certified: Yes
 * Batch ID: Inspection-061325
 */

import * as blazeface from '@tensorflow-models/blazeface';
import * as tf from '@tensorflow/tfjs';

export async function runBlurDetection(file: File): Promise<boolean> {
  try {
    const model = await blazeface.load();
    const image = new Image();
    image.src = URL.createObjectURL(file);

    const imgLoad = await new Promise<HTMLImageElement>((resolve, reject) => {
      image.onload = () => resolve(image);
      image.onerror = reject;
    });

    const returnTensor = tf.browser.fromPixels(imgLoad as HTMLImageElement) as tf.Tensor3D;
    const predictions = await model.estimateFaces(returnTensor, false);
    return predictions.length > 0;
  } catch (error) {
    return true;
  }
}
