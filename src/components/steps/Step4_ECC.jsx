import React, { useState, useRef, useEffect, useCallback } from 'react';
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

  // --- Visual ECC Arithmetic ---
  const a = -1; // From our visual curve y^2 = x^3 - x + 1

  // Point addition: R = P + Q
  const pointAdd = useCallback((P, Q) => {
    if (!P) return Q;
    if (!Q) return P;
    if (P.x === Q.x && P.y === -Q.y) return null; // Point at infinity

    const lambda = (P.x === Q.x && P.y === Q.y)
      ? (3 * P.x ** 2 + a) / (2 * P.y) // Point doubling
      : (Q.y - P.y) / (Q.x - P.x);     // Point addition

    const xR = lambda ** 2 - P.x - Q.x;
    const yR = lambda * (P.x - xR) - P.y;

    return { x: xR, y: yR };
  }, [a]);

  // Scalar multiplication: R = n * P
  const multiplyVisual = useCallback((n, P) => {
    let R = null; // Point at infinity
    let T = P;    // Temp point

    while (n > 0) {
      if (n % 2 === 1) {
        R = pointAdd(R, T);
      }
      T = pointAdd(T, T); // Double the point
      n = Math.floor(n / 2);
    }
    return R;
  }, [pointAdd]);

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

    // --- Point Plotting ---
    const plotPoint = (point, color, label) => {
      if (!point) return;
      const canvasX = transformX(point.x);
      const canvasY = transformY(point.y);
      ctx.beginPath();
      ctx.arc(canvasX, canvasY, 5, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.fillStyle = 'black';
      ctx.fillText(label, canvasX + 10, canvasY + 5);
    };

    // Define a "visual" generator point on our representative curve
    const visualG = { x: -1.25, y: Math.sqrt((-1.25)**3 - (-1.25) + 1) };

    // Calculate k * visualG
    const visualK = multiplyVisual(k, visualG);

    // Plot points
    plotPoint(visualG, 'blue', 'G');
    plotPoint(visualK, 'red', 'K');

  }, [k, multiplyVisual]);

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
