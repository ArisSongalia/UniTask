import React, { useRef, useEffect, useState, useCallback } from 'react';
import { IconTitleSection } from '../TitleSection';
import { IconAction } from '../Icon';

function MainCanvas({ closeModal }) {
  const virtualCanvasRef = useRef(null);
  const viewCanvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const scaleRef = useRef(1);
  const offsetRef = useRef({ x: 0, y: 0 });
  const startPointRef = useRef({ x: 0, y: 0});

  const renderView = useCallback(() => {
    const virtualCanvas = virtualCanvasRef.current;
    const viewCanvas = viewCanvasRef.current;
    if (!virtualCanvas || !viewCanvas) return;

    const viewCtx = viewCanvas.getContext('2d');
    if (!viewCtx) return;

    viewCtx.clearRect(0, 0, viewCanvas.width, viewCanvas.height);
    viewCtx.save();
    viewCtx.scale(scaleRef.current, scaleRef.current);
    viewCtx.translate(offsetRef.current.x, offsetRef.current.y);
    viewCtx.drawImage(virtualCanvas, 0, 0);
    viewCtx.restore();
  }, []);

  useEffect(() => {
    const virtualCanvas = virtualCanvasRef.current;
    const viewCanvas = viewCanvasRef.current;
    if (!virtualCanvas || !viewCanvas) return;

    const virtualCtx = virtualCanvas.getContext('2d');
    if (!virtualCtx) return;

    virtualCanvas.width = 2000;
    virtualCanvas.height = 2000;

    const setViewCanvasDimensions = () => {
      const rect = viewCanvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      viewCanvas.width = rect.width * dpr;
      viewCanvas.height = rect.height * dpr;
      renderView();
    };

    const startDrawing = (event) => {
      isDrawingRef.current = true;
      const rect = viewCanvas.getBoundingClientRect();
      const x = (event.clientX - rect.left - offsetRef.current.x) / scaleRef.current;
      const y = (event.clientY - rect.top - offsetRef.current.y) / scaleRef.current;
      virtualCtx.fillRect(x, y, 2.5, 2.5);
      renderView();
    };

    const startLineDrawing = (event) => {
      isDrawingRef.current = true;
      const rect = viewCanvas.getBoundingClientRect();
      const x = (event.clientX - rect.left - offsetRef.current.x) / scaleRef.current;
      const y = (event.clientY - rect.top - offsetRef.current.x) / scaleRef.current;

      startPointRef.current = {x, y};
      virtualCtx.beginPath();
      virtualCanvas.moveTo(x, y);
      renderView();
    }

    const lineDraw = (event) => {
      if (!isDrawingRef.current) return;
      const rect = viewCanvas.getBoundingClientRect();
      const x = (event.clientX - rect.left - offsetRef.current.x) / scaleRef.current;
      const y = (event.clientY - rect.top - offsetRef.current.y) / scaleRef.current;

      virtualCtx.lineTo(x, y);
      virtualCtx.stroke();
      renderView();
    }

    const stopLineDrawing = () => {
      if (isDrawingRef.current) {
        isDrawingRef.current = false;
        virtualCtx.closePath();
      }
    }

    const stopDrawing = () => {
      isDrawingRef.current = false;
    };

    const draw = (event) => {
      if (!isDrawingRef.current) return;
      const rect = viewCanvas.getBoundingClientRect();
      const x = (event.clientX - rect.left - offsetRef.current.x) / scaleRef.current;
      const y = (event.clientY - rect.top - offsetRef.current.y) / scaleRef.current;
      virtualCtx.fillRect(x, y, 2.5, 2.5);
      renderView();
    };

    setViewCanvasDimensions();

    viewCanvas.addEventListener('mousedown', startLineDrawing);
    viewCanvas.addEventListener('mouseup', stopLineDrawing);
    viewCanvas.addEventListener('mousemove', lineDraw);
    viewCanvas.addEventListener('mouseleave', stopDrawing)
    window.addEventListener('resize', setViewCanvasDimensions);

    return () => {
      viewCanvas.removeEventListener('mousedown', startLineDrawing);
      viewCanvas.removeEventListener('mouseup', stopLineDrawing);
      viewCanvas.removeEventListener('mousemove', lineDraw);
      viewCanvas.removeEventListener('mouseleave', stopDrawing);
      window.removeEventListener('resize', setViewCanvasDimensions);
    };
  }, [renderView]);

  const resetCanvas = () => {
    const virtualCanvas = virtualCanvasRef.current;
    const viewCanvas = viewCanvasRef.current;
    if (!virtualCanvas || !viewCanvas) return;

    const virtualCtx = virtualCanvas.getContext('2d');
    const viewCtx = viewCanvas.getContext('2d');

    if (virtualCtx && viewCtx) {
      virtualCtx.clearRect(0, 0, virtualCanvas.width, virtualCanvas.height);
      viewCtx.clearRect(0, 0, viewCanvas.width, viewCanvas.height);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center h-full w-full p-4 bg-black bg-opacity-50">
      <div
        className="flex flex-col p-4 bg-white rounded-md w-full max-w-screen-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <IconTitleSection title="Canvas" dataFeather="x" iconOnClick={closeModal} />
        <section className='action-icons w-full flex mb-2'>
          <IconAction dataFeather='refresh-cw' iconOnClick={resetCanvas}/>
        </section>

        <canvas ref={viewCanvasRef} className="bg-gray-50 h-[80vh] w-full rounded-md border"></canvas>
        <canvas ref={virtualCanvasRef} style={{ display: 'none' }}></canvas>
      </div>
    </div>
  );
}

export default MainCanvas;
