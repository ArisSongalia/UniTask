import React, { useRef, useEffect, useState, useCallback } from 'react';
import { IconTitleSection } from '../TitleSection';
import { IconAction } from '../Icon';

function MainCanvas({ closeModal }) {
  const virtualCanvasRef = useRef(null);
  const viewCanvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const scaleRef = useRef(1);
  const offsetRef = useRef({ x: 0, y: 0 });
  const startPointRef = useRef({ x: 0, y: 0 });
  const [isActiveTool, setIsActiveTool] = useState({
    erase: false,
    pencil: true,
  });
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const getVirtualCanvasAndContext = () => {
    const virtualCanvas = virtualCanvasRef.current;
    if (!virtualCanvas) return { virtualCanvas: null, virtualCtx: null };

    const virtualCtx = virtualCanvas.getContext('2d');
    return { virtualCanvas, virtualCtx };
  };

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

    setViewCanvasDimensions();
    window.addEventListener('resize', setViewCanvasDimensions);

    return () => {
      window.removeEventListener('resize', setViewCanvasDimensions);
    };
  }, [renderView]);

  useEffect(() => {
    const viewCanvas = viewCanvasRef.current;
    if (!viewCanvas) return;

    const virtualCtx = virtualCanvasRef.current.getContext('2d');
    if (!virtualCtx) return;

    const toolHandlers = {
      erase: (virtualCtx, x, y) => {
        virtualCtx.clearRect(x - 10, y - 10, 20, 20); 
      },
      pencil: (virtualCtx, x, y) => {
        virtualCtx.lineTo(x, y); 
        virtualCtx.stroke();
      },
    };

    const saveCanvasState = () => {
      const { virtualCanvas, virtualCtx } = getVirtualCanvasAndContext();
      if (!virtualCanvas || !virtualCtx) return;

      const imageData = virtualCtx.getImageData(0, 0, virtualCanvas.width, virtualCanvas.height);

      setUndoStack((prev) => [...prev, imageData]);

      setRedoStack([]);
    };

    const startAction = (event) => {
      isDrawingRef.current = true;
      saveCanvasState();

      const rect = viewCanvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const x = (event.clientX - rect.left - offsetRef.current.x) / (scaleRef.current * dpr);
      const y = (event.clientY - rect.top - offsetRef.current.y) / (scaleRef.current * dpr);

      startPointRef.current = { x, y };
      virtualCtx.beginPath();
      virtualCtx.moveTo(x, y);

      renderView();
    };

    const action = (event) => {
      if (!isDrawingRef.current) return;

      const rect = viewCanvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const x = (event.clientX - rect.left - offsetRef.current.x) / (scaleRef.current * dpr);
      const y = (event.clientY - rect.top - offsetRef.current.y) / (scaleRef.current * dpr);

      const activeTool = Object.keys(isActiveTool).find((tool) => isActiveTool[tool]);

      if (activeTool && toolHandlers[activeTool]) {
        toolHandlers[activeTool](virtualCtx, x, y);
        renderView();
      }
    };

    const stopCurrentAction = () => {
      if (isDrawingRef.current) {
        isDrawingRef.current = false;
        virtualCtx.closePath();
      }
    };

    const stopAction = () => {
      isDrawingRef.current = false;
    };

    if (isActiveTool.pencil || isActiveTool.erase) {
      viewCanvas.addEventListener('mousedown', startAction);
      viewCanvas.addEventListener('mouseup', stopCurrentAction);
      viewCanvas.addEventListener('mousemove', action);
      viewCanvas.addEventListener('mouseleave', stopAction);
    }

    return () => {
      viewCanvas.removeEventListener('mousedown', startAction);
      viewCanvas.removeEventListener('mouseup', stopCurrentAction);
      viewCanvas.removeEventListener('mousemove', action);
      viewCanvas.removeEventListener('mouseleave', stopAction);
    };
  }, [isActiveTool.pencil, isActiveTool.erase, renderView]);

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
  };

  const selectTool = (tool) => {
    setIsActiveTool((prev) => ({
      erase: tool === 'erase' ? !prev.erase : false,
      pencil: tool === 'pencil' ? !prev.pencil : false,
    }));
  };

  const handleUndo = useCallback(() => {
    const { virtualCanvas, virtualCtx } = getVirtualCanvasAndContext();
    if (!virtualCanvas || !virtualCtx || undoStack.length === 0) return;

    const lastState = undoStack[undoStack.length - 1];

    setUndoStack((prev) => prev.slice(0, -1));
    setRedoStack((prev) => [...prev, virtualCtx.getImageData(0, 0, virtualCanvas.width, virtualCanvas.height)]);

    if (lastState) {
      virtualCtx.putImageData(lastState, 0, 0);
      renderView();
    }
  }, [undoStack, redoStack, renderView]);

  const handleRedo = useCallback(() => {
    const { virtualCanvas, virtualCtx } = getVirtualCanvasAndContext();
    if (!virtualCanvas || !virtualCtx || redoStack.length === 0) return;

    const lastState = redoStack[redoStack.length - 1];

    setRedoStack((prev) => prev.slice(0, -1));
    setUndoStack((prev) => [...prev, virtualCtx.getImageData(0, 0, virtualCanvas.width, virtualCanvas.height)]);

    if (lastState) {
      virtualCtx.putImageData(lastState, 0, 0);
      renderView();
    }
  }, [undoStack, redoStack, renderView]);

  useEffect(() => {
    const handleUndoRedoShortcut = (event) => {
      if (event.ctrlKey && event.key === 'z') {
        event.preventDefault();
        handleUndo();
      } else if (event.ctrlKey && event.key === 'y') {
        event.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleUndoRedoShortcut);

    return () => {
      window.removeEventListener('keydown', handleUndoRedoShortcut);
    };

  }, [handleUndo, handleRedo]);


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center h-full w-full p-4 bg-black bg-opacity-50" onClick={closeModal}>
      <div
        className="flex flex-col p-4 bg-white rounded-md w-full max-w-screen-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <IconTitleSection title="Canvas" dataFeather="x" iconOnClick={closeModal} />
        <section className='action-icons w-full gap-1 flex mb-2'>
          <section className='w-full flex gap-1'>
            <IconAction
              dataFeather='edit-2'
              className={`${isActiveTool.pencil ? "bg-green-700 text-white" : ""}`}
              iconOnClick={() => selectTool('pencil')}
            />
            <IconAction
              dataFeather='x-circle'
              className={`${isActiveTool.erase ? "bg-green-700 text-white" : ""}`}
              iconOnClick={() => selectTool('erase')}
            />
          </section>

          <IconAction 
            dataFeather='arrow-left' 
            iconOnClick={handleUndo}
          />
          <IconAction 
            dataFeather='arrow-right' 
            iconOnClick={handleRedo}
          />
          <IconAction 
            dataFeather='refresh-cw' 
            iconOnClick={resetCanvas} 
          />
          <IconAction dataFeather="more-vertical" />
        </section>

        <canvas ref={viewCanvasRef} className="bg-gray-50 h-[80vh] w-full rounded-md border"></canvas>
        <canvas ref={virtualCanvasRef} style={{ display: 'none' }}></canvas>
      </div>
    </div>
  );
}

export default MainCanvas;