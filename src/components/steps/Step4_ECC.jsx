import React, { useState, useRef, useEffect } from 'react';
import { G, multiply } from '../../lib/crypto';

const Step4_ECC = () => {
  const [k, setK] = useState(1);
  const [K, setKPoint] = useState(G);
  const canvasRef = useRef(null);

  const handleSliderChange = (event) => {
    const newK = parseInt(event.target.value, 10);
    setK(newK);
    const newKPoint = multiply(newK);
    setKPoint(newKPoint);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // A smaller, visually representative curve: y^2 = x^3 - x + 1
    // const a = -1;
    // const b = 1;

    // Visualization parameters
    const scale = 50;
    const offsetX = width / 2;
    const offsetY = height / 2;

    // Coordinate transformation for the visual curve
    const transformX = (x) => x * scale + offsetX;
    const transformY = (y) => -y * scale + offsetY;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw axes
    ctx.beginPath();
    ctx.moveTo(0, offsetY);
    ctx.lineTo(width, offsetY);
    ctx.moveTo(offsetX, 0);
    ctx.lineTo(offsetX, height);
    ctx.strokeStyle = '#ccc';
    ctx.stroke();

    // Draw the curve
    ctx.beginPath();
    ctx.strokeStyle = '#666';
    for (let x = -width / 2; x < width / 2; x++) {
      const x_val = (x) / scale;
      const y_squared = x_val ** 3 - x_val + 1;
      if (y_squared >= 0) {
        const y_val = Math.sqrt(y_squared);
        ctx.lineTo(transformX(x_val), transformY(y_val));
      }
    }
    for (let x = width / 2 -1; x >= -width/2; x--) {
        const x_val = (x) / scale;
        const y_squared = x_val ** 3 - x_val + 1;
        if (y_squared >= 0) {
          const y_val = -Math.sqrt(y_squared);
          ctx.lineTo(transformX(x_val), transformY(y_val));
        }
      }
    ctx.stroke();

    // --- Point plotting ---
    // We can't plot the real G and K, so we'll simulate their positions.
    // This is a simplified visualization. A real one would require a more
    // complex mapping from the large curve to the small one.

    // Let's define a "visual" generator point on our representative curve
    const visualG = { x: -0.5, y: Math.sqrt((-0.5)**3 - (-0.5) + 1) };

    // A simple way to visualize k*G is to just move along the curve.
    // This is not cryptographically accurate but serves the visual purpose.
    const visual_k_x = -0.5 + (k * 0.1);
    const y_sq = visual_k_x ** 3 - visual_k_x + 1;
    const visual_k_y = Math.sqrt(y_sq > 0 ? y_sq : 0) * (k % 2 === 0 ? -1 : 1);


    const plotPoint = (x, y, color, label) => {
      const canvasX = transformX(x);
      const canvasY = transformY(y);
      ctx.beginPath();
      ctx.arc(canvasX, canvasY, 5, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.fillStyle = 'black';
      ctx.fillText(label, canvasX + 10, canvasY + 5);
    };

    plotPoint(visualG.x, visualG.y, 'blue', 'G');
    plotPoint(visual_k_x, visual_k_y, 'red', 'K');

  }, [k]);

  return (
    <div className="step-container">
      <div className="text-column">
        <h1>Step 4: Interactive ECC Visualizer</h1>
        <div className="ecc-controls">
          <label htmlFor="k-slider">Scalar k: {k}</label>
          <input
            id="k-slider"
            type="range"
            min="1"
            max="20"
            value={k}
            onChange={handleSliderChange}
          />
        </div>
        <div className="ecc-info">
          <p>Generator Point G: ({G.x.toString()}, {G.y.toString()})</p>
          <p>Current Scalar k: {k}</p>
          <p>Resulting Point K = k * G: ({K.x.toString()}, {K.y.toString()})</p>
        </div>
      </div>
      <div className="animation-column">
        <canvas ref={canvasRef} width="500" height="500" style={{ border: '1px solid black' }}></canvas>
      </div>
    </div>
  );
};

export default Step4_ECC;
