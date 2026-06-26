import { useEffect, useRef } from 'react';

// Keyboard bindings that mirror the physical D-pad. DPad.tsx passes the same
// handlers it wires to the on-screen arms, so keyboard and click stay in
// lockstep. Enter doubles as right/select.
export interface DPadHandlers {
  onUp: () => void;
  onDown: () => void;
  onLeft: () => void;
  onRight: () => void;
}

export function useDPad(handlers: DPadHandlers) {
  // Hold the latest handlers in a ref so the window listener registers once
  // and never goes stale, even as parent callbacks change identity each render.
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const h = handlersRef.current;
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault(); // stop the page from scrolling
          h.onUp();
          break;
        case 'ArrowDown':
          e.preventDefault();
          h.onDown();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          h.onLeft();
          break;
        case 'ArrowRight':
          e.preventDefault();
          h.onRight();
          break;
        case 'Enter':
          h.onRight();
          break;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);
}
