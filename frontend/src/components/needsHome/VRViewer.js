// File: VRViewer.js
// Path: frontend/src/components/VRViewer.js

import React from 'react';
import 'aframe';

const VRViewer = ({ vrTourUrl }) => {
  if (!vrTourUrl) {
    return <div className="text-center text-gray-500">❌ No VR tour available</div>;
  }

  return (
    <div className="vr-viewer w-full h-screen">
      <a-scene embedded>
        <a-videosphere src={vrTourUrl} rotation="0 180 0"></a-videosphere>
        <a-camera position="0 1.6 0"></a-camera>
      </a-scene>
    </div>
  );
};

export default VRViewer;
