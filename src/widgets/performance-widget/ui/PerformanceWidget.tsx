import React, { useCallback, useEffect, useRef, useState } from 'react';

import { PerformanceWidgetProps } from '../model/types';

export const PerformanceWidget: React.FC<PerformanceWidgetProps> = ({ updateInterval = 100 }) => {
  const [fps, setFps] = useState(0);
  const [memoryMB, setMemoryMB] = useState<number | null>(null);
  const [domNodes, setDomNodes] = useState(0);
  const [firstRender, setFirstRender] = useState<number | null>(null);
  const [fullLoad, setFullLoad] = useState<number | null>(null);
  const [inputLatency, setInputLatency] = useState<number | null>(null);

  const rafId = useRef<number>(0);
  const lastFrameTime = useRef<number | null>(null);
  const deltas = useRef<number[]>([]);

  // FPS & Jank
  const tick = useCallback((time: number) => {
    if (lastFrameTime.current !== null) {
      const delta = time - lastFrameTime.current;
      deltas.current.push(delta);
    }

    lastFrameTime.current = time;
    rafId.current = requestAnimationFrame(tick);
  }, []);

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

  // Full Load Time
  useEffect(() => {
    const updateFullLoad = () => {
      const now = performance.now();

      const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      if (navEntries.length > 0) {
        const nav = navEntries[0];

        if (nav.loadEventEnd > 0) {
          setFullLoad(nav.loadEventEnd);
          return;
        }
      }

      const timing = (performance as any).timing;
      if (timing && timing.loadEventEnd && timing.navigationStart) {
        setFullLoad(timing.loadEventEnd - timing.navigationStart);
        return;
      }

      setFullLoad(now);
    };

    if (document.readyState === 'complete') {
      updateFullLoad();
    } else {
      window.addEventListener('load', updateFullLoad);
      return () => window.removeEventListener('load', updateFullLoad);
    }
  }, []);

  // Input Latency Test
  useEffect(() => {
    const handler = () => {
      const start = performance.now();
      requestAnimationFrame(() => {
        const end = performance.now();
        setInputLatency(end - start);
      });
    };
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, []);

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
      <div>FPS: {fps.toFixed(2)}</div>
      <div>Memory: {memoryMB !== null ? memoryMB.toFixed(2) + ' MB' : 'N/A'}</div>
      <div>DOM Nodes: {domNodes}</div>
      <div>First Render: {firstRender !== null ? firstRender.toFixed(2) + ' ms' : 'N/A'}</div>
      <div>Full Load: {fullLoad !== null ? fullLoad.toFixed(2) + ' ms' : 'N/A'}</div>
      <div>Input Latency: {inputLatency !== null ? inputLatency.toFixed(2) + ' ms' : 'Click to test'}</div>
    </div>
  );
};
