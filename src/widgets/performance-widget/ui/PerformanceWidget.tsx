import React, { useCallback, useEffect, useRef, useState } from 'react';

import { PerformanceWidgetProps } from '../model/types';

export const PerformanceWidget: React.FC<PerformanceWidgetProps> = ({ updateInterval = 100 }) => {
  const [fps, setFps] = useState(0);
  const [memoryMB, setMemoryMB] = useState<number | null>(null);
  const [domNodes, setDomNodes] = useState(0);
  const [firstRender, setFirstRender] = useState<number | null>(null);
  // const [inputLatency, setInputLatency] = useState<number | null>(null);

  const rafId = useRef<number>(0);
  const lastFrameTime = useRef<number | null>(null);
  const deltas = useRef<number[]>([]);

  const tick = useCallback((time: number) => {
    if (lastFrameTime.current !== null) {
      const delta = time - lastFrameTime.current;
      deltas.current.push(delta);
    }

    lastFrameTime.current = time;
    rafId.current = requestAnimationFrame(tick);
  }, []);

  // FPS, RAM, DOM-nodes
  useEffect(() => {
    rafId.current = requestAnimationFrame(tick);

    const intervalId = setInterval(() => {
      const samples = deltas.current;
      const avgDelta = samples.length ? samples.reduce((a, b) => a + b, 0) / samples.length : 0;
      const currentFps = avgDelta > 0 ? 1000 / avgDelta : 0;
      setFps(currentFps);

      deltas.current = [];

      const memory = (performance as any).memory;
      setMemoryMB(memory ? memory.usedJSHeapSize / 1024 / 1024 : null);

      setDomNodes(document.getElementsByTagName('*').length);
    }, updateInterval);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      clearInterval(intervalId);
    };
  }, [updateInterval, tick]);

  // First Contentful Paint
  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      const entry = list.getEntriesByName('first-contentful-paint')[0];
      if (entry) setFirstRender(entry.startTime);
    });

    observer.observe({ type: 'paint', buffered: true });
    return () => observer.disconnect();
  }, []);

  // Input Latency Test
  // useEffect(() => {
  //   const handler = () => {
  //     const start = performance.now();
  //     requestAnimationFrame(() => {
  //       const end = performance.now();
  //       setInputLatency(end - start);
  //     });
  //   };
  //   window.addEventListener('click', handler);
  //   return () => window.removeEventListener('click', handler);
  // }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: '64px',
        right: 0,
        width: '240px',
        padding: '10px',
        background: 'rgba(0,0,0,0.75)',
        color: 'white',
        fontSize: '13px',
        fontFamily: 'monospace',
        lineHeight: 1.6,
        zIndex: 100,
        pointerEvents: 'none'
      }}
    >
      <div id="fps">FPS: {fps.toFixed(2)}</div>
      <div id="memory">Memory: {memoryMB !== null ? memoryMB.toFixed(2) + ' MB' : 'N/A'}</div>
      <div id="dom-nodes">DOM Nodes: {domNodes}</div>
      <div id="first-render-time">
        First Render Time: {firstRender !== null ? firstRender.toFixed(2) + ' ms' : 'N/A'}
      </div>
      {/* <div id="input-latency">
        Input Latency: {inputLatency !== null ? inputLatency.toFixed(2) + ' ms' : 'Click to test'}
      </div> */}
    </div>
  );
};
