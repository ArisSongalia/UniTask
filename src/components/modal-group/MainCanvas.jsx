import React, { useRef, useEffect } from 'react';
import { IconTitleSection } from '../TitleSection';

function MainCanvas({ closeModal }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'blue';
        ctx.fillRect(50, 50, 200, 100);
      }
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center h-full w-full p-4 bg-black bg-opacity-50">
      <div
        className="flex flex-col p-4 bg-white rounded-md h-[90vh] w-full max-w-screen-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <IconTitleSection title="Canvas" iconOnClick={closeModal} dataFeather="x" />
        <canvas
          ref={canvasRef}
          className="bg-gray-50 h-full w-full rounded-md border"
        ></canvas>
      </div>
    </div>
  );
}

export default MainCanvas;