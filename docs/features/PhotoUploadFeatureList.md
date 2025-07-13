# CFH Feature: Photo Upload Component

**Artifact ID:** 37281b3d-4e5f-4992-9fc9-39e2bff5891d  
**Artifact Version ID:** 72e64031-e58b-4a8b-88e5-6e7f79938db9  
**Title:** Photo Upload Feature List  
**Save Location:** C:\CFH\docs\features\PhotoUploadFeatureList.md

---

## 🎯 Purpose
Allow users to securely upload inspection photos with built-in image quality validation (blurriness detection), preview display, and backend logging for auditing. Enables clear, accessible, and valid evidence upload in inspection workflows.

---

## 🧩 Frontend Component: PhotoUpload.tsx
**Path:** C:\CFH\frontend\src\components\inspection\PhotoUpload.tsx  
**Type:** React Functional Component (TypeScript)

### ✅ Features by Tier

#### Free Tier
- Upload inspection photos (`image/*` files only)
- Accessibility support (`aria-label`, `aria-busy`, keyboard nav)
- Preview thumbnails after selection
- Multiple file upload (batch selection)
- Toast notifications for upload feedback

#### Standard Tier
- Blur detection using BlazeFace (via `@tensorflow-models/blazeface`)
- Skips blurry photos
- Retry mechanism for failed uploads
- X-Correlation-ID header and secure JWT mock token handling

#### Premium Tier
- Audit logging via `@services/auditLog`
- Timestamped and correlated event logs
- Progress handling UI and file clearing logic post-upload

#### Wow++ Tier
- (Reserved) Image auto-tagging (AI vision labeling)
- Drag & drop support (future)
- EXIF metadata stripping for privacy (future)


---

## 🧪 Unit Tests: PhotoUpload.test.tsx
**Path:** C:\CFH\frontend\src\tests\inspection\PhotoUpload.test.tsx

### ✅ Coverage
- Rendering UI elements (button, input)
- File change and preview display
- Upload success (mocked)
- Upload retry flow
- ARIA compliance

---

## 🛠 Utility Integration
**Used From:** `@/packages/inspection-utils/blurDetector.ts`
- May optionally refactor future logic into `blurDetector.ts` for shared reuse

---

## 📝 Related Markdown Files
- **Component Function Doc:** C:\CFH\docs\functions\components\PhotoUpload-functions.md
- **Feature Spec:** This file

---

## ✅ Save Summary
This file should be saved to:  
**C:\CFH\docs\features\PhotoUploadFeatureList.md**

The related component file must be saved to:  
**C:\CFH\frontend\src\components\inspection\PhotoUpload.tsx**

And its test file to:  
**C:\CFH\frontend\src\tests\inspection\PhotoUpload.test.tsx**
