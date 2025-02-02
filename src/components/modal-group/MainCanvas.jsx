import React, { useRef, useEffect, useState } from 'react';
import { IconTitleSection } from '../TitleSection';

function MainCanvas({ closeModal }) {
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const startDrawing = () => {
      isDrawingRef.current = true;
    };

    const stopDrawing = () => {
      isDrawingRef.current = false;
    };

    const draw = (event) => {
      if (!isDrawingRef.current) return;
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      ctx.fillRect(x, y, 2.5, 2.5);
    };

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseleave', stopDrawing);

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseleave', stopDrawing);
    };
  }, []); 

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center h-full w-full p-4 bg-black bg-opacity-50">
      <div
        className="flex flex-col p-4 bg-white rounded-md w-full max-w-screen-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <IconTitleSection title="Canvas" iconOnClick={closeModal} dataFeather="x" />
        <canvas
          ref={canvasRef}
          className="bg-gray-50 h-[80vh] w-full rounded-md border"
        ></canvas>
      </div>
    </div>
  );
}

export default MainCanvas;
