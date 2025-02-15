// components/PoseTransfer.jsx
import { useState, useRef } from "react";

export default function PoseTransfer() {
  const [sourceSilhouette, setSourceSilhouette] = useState(null);
  const [targetSilhouette, setTargetSilhouette] = useState(null);
  const [renderedLimb, setRenderedLimb] = useState(null);
  const canvasRef = useRef(null);

  const handleImageUpload = (event, setter) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          setter(img);
          if (sourceSilhouette && targetSilhouette && renderedLimb) {
            processImages(sourceSilhouette, targetSilhouette, renderedLimb);
          }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const processImages = (sourceImg, targetImg, renderedImg) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = targetImg.width;
    canvas.height = targetImg.height;

    const sourceCanvas = document.createElement("canvas");
    const targetCanvas = document.createElement("canvas");
    sourceCanvas.width = sourceImg.width;
    sourceCanvas.height = sourceImg.height;
    targetCanvas.width = targetImg.width;
    targetCanvas.height = targetImg.height;

    const sCtx = sourceCanvas.getContext("2d");
    const tCtx = targetCanvas.getContext("2d");

    sCtx.drawImage(sourceImg, 0, 0);
    tCtx.drawImage(targetImg, 0, 0);

    const sourceData = sCtx.getImageData(
      0,
      0,
      sourceCanvas.width,
      sourceCanvas.height
    );
    const targetData = tCtx.getImageData(
      0,
      0,
      targetCanvas.width,
      targetCanvas.height
    );

    const sourceBounds = findBoundingBox(sourceData);
    const targetBounds = findBoundingBox(targetData);

    const transform = calculateTransform(sourceBounds, targetBounds);

    ctx.save();
    ctx.setTransform(
      transform.scale.x,
      0,
      0,
      transform.scale.y,
      transform.translate.x,
      transform.translate.y
    );

    ctx.drawImage(renderedImg, 0, 0);
    ctx.restore();
  };

  const findBoundingBox = (imageData) => {
    const width = imageData.width;
    const height = imageData.height;
    let minX = width,
      minY = height,
      maxX = 0,
      maxY = 0;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        if (imageData.data[idx + 3] > 0) {
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
      }
    }

    return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
  };
  const downloadImage = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "transformed-pose.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };
  const calculateTransform = (source, target) => {
    const scaleX = target.width / source.width;
    const scaleY = target.height / source.height;
    const translateX = target.x - source.x * scaleX;
    const translateY = target.y - source.y * scaleY;

    return {
      scale: { x: scaleX, y: scaleY },
      translate: { x: translateX, y: translateY },
    };
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ marginBottom: "1rem" }}>
        <label>Source Silhouette:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, setSourceSilhouette)}
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>Target Silhouette:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, setTargetSilhouette)}
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>Rendered Limb:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, setRenderedLimb)}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <canvas
          ref={canvasRef}
          style={{ border: "1px solid #ccc", maxWidth: "100%" }}
        />
        <button
          onClick={downloadImage}
          style={{ marginBottom: "1rem", padding: "8px 16px" }}
          disabled={!renderedLimb}
        >
          Download Result
        </button>
      </div>
    </div>
  );
}
