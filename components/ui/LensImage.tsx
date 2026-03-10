"use client";

import { useState, useRef, useCallback } from "react";

interface LensImageProps {
  baseGrad: string;
  revealGrad: string;
  emoji: string;
  revealEmoji: string;
  lensSize?: number;
  children?: React.ReactNode;
  className?: string;
}

export default function LensImage({
  baseGrad,
  revealGrad,
  emoji,
  revealEmoji,
  lensSize = 160,
  children,
  className = "",
}: LensImageProps) {
  const r = lensSize / 2;
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current!.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    if (!active) setActive(true);
  }, [active]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden select-none ${className}`}
      style={{ cursor: active ? "crosshair" : "default" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setActive(false)}
    >
      <div className={`absolute inset-0 bg-linear-to-br ${baseGrad} flex items-center justify-center`}>
        <span className="text-6xl drop-shadow-lg">{emoji}</span>
      </div>
      <div className="relative z-10 w-full h-full">{children}</div>
      {active && (
        <>
          <div
            className="absolute z-30 rounded-full bg-white/70 pointer-events-none"
            style={{ left: pos.x - 4, top: pos.y - 4, width: 8, height: 8 }}
          />
          <div
            className="absolute z-20 rounded-full overflow-hidden pointer-events-none"
            style={{
              left: pos.x - r,
              top: pos.y - r,
              width: lensSize,
              height: lensSize,
              border: "2.5px solid rgba(255,255,255,0.6)",
              boxShadow: "0 0 0 1px rgba(0,0,0,0.12), inset 0 2px 12px rgba(255,255,255,0.15), 0 10px 36px rgba(0,0,0,0.28)",
            }}
          >
            <div
              className={`absolute bg-linear-to-tl ${revealGrad} flex items-center justify-center`}
              style={{
                left: r - pos.x,
                top: r - pos.y,
                width: containerRef.current?.clientWidth ?? 256,
                height: containerRef.current?.clientHeight ?? 256,
              }}
            >
              <span className="text-6xl drop-shadow-lg">{revealEmoji}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
