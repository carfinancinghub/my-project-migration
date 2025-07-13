# PhotoUpload Component – Function Documentation
**File:** `C:\CFH\frontend\components\inspection\PhotoUpload.tsx`  
**Batch ID:** Inspection-061325

## handleFileChange(event)
**Description:**  
Handles selection of photo files and generates object URLs for preview display.

- **Input:**  
  - `event`: React.ChangeEvent<HTMLInputElement>
- **Output:**  
  - Updates component state with `photos: File[]` and `previews: string[]`

## runBlurDetection(file)
**Description:**  
Detects if an image is likely blurry using TensorFlow BlazeFace (face presence = clear).

- **Input:**  
  - `file`: File
- **Output:**  
  - Promise<boolean> (true = clear, false = blurry)

## handleUpload()
**Description:**  
Validates and uploads photos using FormData. Performs one retry if the upload fails.  
Logs success via `logAuditEncrypted`.

- **Input:**  
  - Internal state: `photos[]`, `inspectionId`
- **Output:**  
  - UI feedback via Toastify, audit event triggered.

## Additional Notes
- **ARIA Compliance:**  
  - `aria-label`, `aria-busy`, and live regions ensure screen-reader compatibility.
- **Upload Retry:**  
  - One automatic retry 1000ms after failure.
- **Feature Gating (Future Scope):**  
  - Tier-1: Basic upload  
  - Tier-2: Blur detection  
  - Tier-3: CDN offload + AI labeling

---

**Version:** 1.0.0  
**Crown Certified:** Yes