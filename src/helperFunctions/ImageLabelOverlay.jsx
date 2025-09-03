import { Button } from "@fluentui/react-components";
import React, { useEffect, useMemo, useRef, useState } from "react";

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export default function ImageLabelOverlay({
  src,
  anchors,
  show, // optional: subset array, e.g. ['tail','mane']
  labelFormatter, // optional: (key) => "Tail"
  callouts = true, // draw lines from dot -> label
  dot = true, // draw anchor dots
  labelOffset = 100, // base horizontal offset (px)
  className,
  labelStyle,
  lineColor = "black",
  lineWidth = 3,
}) {
  const [hideLabels, setHideLabels] = useState(false);
  const imgRef = useRef(null);
  const [box, setBox] = useState({ w: 0, h: 0 });

  // Keep overlay in sync with rendered image size
  useEffect(() => {
    if (!imgRef.current) return;
    const el = imgRef.current;
    const ro = new ResizeObserver(() => {
      setBox({ w: el.clientWidth || 0, h: el.clientHeight || 0 });
    });
    ro.observe(el);
    // initial
    setBox({ w: el.clientWidth || 0, h: el.clientHeight || 0 });
    return () => ro.disconnect();
  }, [src]);

  const keys = useMemo(() => (Array.isArray(show) && show.length ? show : Object.keys(anchors || {})), [show, anchors]);

  // ----- Mobile-aware sizing knobs -----
  const isMobile = box.w > 0 && box.w <= 480;
  const fontSize = isMobile ? 12 : 16;
  const baseLabelOffset = isMobile ? Math.max(80, labelOffset * 0.8) : labelOffset;
  const minGap = isMobile ? 26 : 22; // min vertical spacing between labels on same side
  const edgePadding = 8;

  // ----- Precompute base positions for all labels -----
  const items = useMemo(() => {
    return keys
      .map((k) => {
        const a = anchors?.[k];
        if (!a) return null;

        const ax = a.x * box.w;
        const ay = a.y * box.h;

        const toRight = a.x <= 0.55; // anchor on left → label on right side
        const dx = toRight ? baseLabelOffset : -baseLabelOffset;
        const dy = a.y < 0.25 ? -30 : a.y > 0.8 ? -10 : -12;

        const lx = clamp(ax + dx, edgePadding, Math.max(edgePadding, box.w - edgePadding));
        const ly = clamp(ay + dy, edgePadding, Math.max(edgePadding, box.h - edgePadding));

        return { k, a, ax, ay, toRight, lx, ly };
      })
      .filter(Boolean);
  }, [keys, anchors, box.w, box.h, baseLabelOffset]);

  // ----- De-overlap per side (simple vertical layout pass) -----
  function applyVerticalSpacing(list) {
    for (let i = 1; i < list.length; i++) {
      const prev = list[i - 1];
      const cur = list[i];
      if (cur.ly - prev.ly < minGap) {
        cur.ly = prev.ly + minGap;
        cur.ly = clamp(cur.ly, edgePadding, Math.max(edgePadding, box.h - edgePadding));
      }
    }
  }

  const rightSide = useMemo(() => {
    const arr = items.filter((it) => it.toRight).sort((a, b) => a.ly - b.ly);
    applyVerticalSpacing(arr);
    return arr;
  }, [items, minGap, box.h]);

  const leftSide = useMemo(() => {
    const arr = items.filter((it) => !it.toRight).sort((a, b) => a.ly - b.ly);
    applyVerticalSpacing(arr);
    return arr;
  }, [items, minGap, box.h]);

  const laidOut = useMemo(() => [...rightSide, ...leftSide], [rightSide, leftSide]);

  return (
    <div className={className} style={{ position: "relative", display: "inline-block", width: "100%" }}>
      <Button appearance='primary' onClick={() => setHideLabels((h) => !h)}>
        {hideLabels ? "Show Labels" : "Hide Labels"}
      </Button>

      <img
        ref={imgRef}
        src={src}
        alt=''
        style={{
          width: "100%", // fill container width
          height: "auto", // keep aspect ratio
          maxWidth: "100%",
          display: "block",
        }}
        onError={(e) => console.warn("Image failed to load:", src, e?.nativeEvent)}
      />

      {/* SVG lines (use adjusted ly) */}
      {!hideLabels && callouts && box.w > 0 && box.h > 0 && (
        <svg viewBox={`0 0 ${box.w || 1} ${box.h || 1}`} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {laidOut.map(({ k, ax, ay, toRight, lx, ly }) => {
            const elbowX = ax + (toRight ? 40 : -40);
            const elbowY = ay;
            return (
              <g key={`line-${k}`}>
                {dot && <circle cx={ax} cy={ay} r='6' fill={lineColor} />}
                <line x1={ax} y1={ay} x2={elbowX} y2={elbowY} stroke={lineColor} strokeWidth={lineWidth} strokeLinecap='round' />
                {/* connect to the adjusted label center for perfect join */}
                <line x1={elbowX} y1={elbowY} x2={lx} y2={ly} stroke={lineColor} strokeWidth={lineWidth} strokeLinecap='round' />
              </g>
            );
          })}
        </svg>
      )}

      {/* Labels (use adjusted lx, ly) */}
      {!hideLabels && box.w > 0 && box.h > 0 && (
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {laidOut.map(({ k, lx, ly }) => (
            <div
              key={`label-${k}`}
              style={{
                position: "absolute",
                left: lx,
                top: ly,
                transform: "translate(-50%, -50%)",
                background: "rgba(0,0,0,0.78)",
                color: "#fff",
                padding: isMobile ? "4px 8px" : "6px 12px",
                borderRadius: 10,
                font: `${fontSize}px/1.2 system-ui, sans-serif`,
                textTransform: "capitalize",
                pointerEvents: "auto",
                ...(labelStyle || {}),
              }}
            >
              {labelFormatter ? labelFormatter(k) : k}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
