"use client";

import { useState, useRef, useCallback } from "react";

interface LensImageProps {
  /** Ảnh thật hiển thị bình thường */
  mainImage?: string;
  /** Ảnh thật hiển thị bên trong kính lúp */
  revealImage?: string;
  /** Fallback gradient nếu không có ảnh (giữ tương thích cũ) */
  baseGrad?: string;
  revealGrad?: string;
  /** Emoji hiển thị trên gradient (fallback) */
  emoji?: string;
  revealEmoji?: string;
  /** Kích thước kính lúp (px) */
  lensSize?: number;
  children?: React.ReactNode;
  className?: string;
  alt?: string;
}

export default function LensImage({
  mainImage,
  revealImage,
  baseGrad   = "from-green-900 via-green-800 to-emerald-900",
  revealGrad = "from-amber-700 via-orange-600 to-amber-500",
  emoji      = "🌿",
  revealEmoji = "🏔️",
  lensSize   = 168,
  children,
  className  = "",
  alt        = "",
}: LensImageProps) {
  const r = lensSize / 2;
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos]       = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current!.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    if (!active) setActive(true);
  }, [active]);

  const usePhoto = !!(mainImage && revealImage);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden select-none ${className}`}
      style={{ cursor: active ? "crosshair" : "default" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setActive(false)}
    >
      {/* ── BASE LAYER ── */}
      {usePhoto ? (
        /* Real photo mode */
        <div className="absolute inset-0">
          <img
            src={mainImage}
            alt={alt}
            className="w-full h-full object-cover"
            onLoad={() => setLoaded(true)}
          />
          {/* Subtle vignette */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(26,46,27,0.45) 0%, transparent 55%)",
            }}
          />
          {/* Loading shimmer */}
          {!loaded && (
            <div className="absolute inset-0 bg-[#1a2e1b] animate-pulse" />
          )}
        </div>
      ) : (
        /* Gradient fallback */
        <div
          className={`absolute inset-0 bg-gradient-to-br ${baseGrad} flex items-center justify-center`}
        >
          <span className="text-6xl drop-shadow-lg">{emoji}</span>
        </div>
      )}

      {/* ── CHILDREN (badge, buttons, etc.) ── */}
      <div className="relative z-10 w-full h-full">{children}</div>

      {/* ── LENS ── */}
      {active && (
        <>
          {/* Crosshair dot */}
          <div
            className="absolute z-30 rounded-full bg-white/70 pointer-events-none"
            style={{ left: pos.x - 4, top: pos.y - 4, width: 8, height: 8 }}
          />

          {/* Magnifier glass */}
          <div
            className="absolute z-20 rounded-full overflow-hidden pointer-events-none"
            style={{
              left:  pos.x - r,
              top:   pos.y - r,
              width: lensSize,
              height: lensSize,
              border: "2px solid rgba(255,255,255,0.55)",
              boxShadow:
                "0 0 0 1px rgba(0,0,0,0.12), inset 0 2px 12px rgba(255,255,255,0.12), 0 10px 36px rgba(0,0,0,0.30)",
            }}
          >
            {usePhoto ? (
              /* Photo reveal inside lens */
              <div
                className="absolute"
                style={{
                  left:   r - pos.x,
                  top:    r - pos.y,
                  width:  containerRef.current?.clientWidth  ?? 320,
                  height: containerRef.current?.clientHeight ?? 256,
                }}
              >
                <img
                  src={revealImage}
                  alt={alt}
                  className="w-full h-full object-cover"
                  style={{ transform: "scale(1.55)", transformOrigin: `${pos.x}px ${pos.y}px` }}
                />
                {/* Warm tint inside lens */}
                <div
                  className="absolute inset-0"
                  style={{ background: "rgba(246,200,122,0.10)", mixBlendMode: "overlay" }}
                />
              </div>
            ) : (
              /* Gradient fallback inside lens */
              <div
                className={`absolute bg-gradient-to-tl ${revealGrad} flex items-center justify-center`}
                style={{
                  left:   r - pos.x,
                  top:    r - pos.y,
                  width:  containerRef.current?.clientWidth  ?? 256,
                  height: containerRef.current?.clientHeight ?? 256,
                }}
              >
                <span className="text-6xl drop-shadow-lg">{revealEmoji}</span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}