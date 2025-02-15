// components/ImageDownsampler.jsx
import { useState, useRef } from "react";

export default function ImageDownsampler() {
  const [scale, setScale] = useState(50);
  const canvasRef = useRef(null);
  const [originalImage, setOriginalImage] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          setOriginalImage(img);
          drawImage(img, scale);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "downsampled-image.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const drawImage = (img, scalePercent) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const newWidth = Math.floor(img.width * (scalePercent / 100));
    const newHeight = Math.floor(img.height * (scalePercent / 100));
    canvas.width = newWidth;
    canvas.height = newHeight;
    ctx.drawImage(img, 0, 0, newWidth, newHeight);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ marginBottom: "1rem" }}>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <label>Scale: {scale}%</label>
        <input
          type="range"
          min="1"
          max="100"
          value={scale}
          onChange={(e) => {
            setScale(e.target.value);
            if (originalImage) drawImage(originalImage, e.target.value);
          }}
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
          disabled={!originalImage}
        >
          Download Image
        </button>
      </div>
    </div>
  );
}
