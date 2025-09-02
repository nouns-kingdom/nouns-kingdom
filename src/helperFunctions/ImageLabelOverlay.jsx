import { Button } from "@fluentui/react-components";
import React, { useLayoutEffect, useMemo, useRef, useState } from "react";

/**
 * anchors shape:
 * {
 *   ear:   { x: 0.63, y: 0.10 },
 *   eye:   { x: 0.60, y: 0.28 },
 *   ...
 * }
 * x,y are normalized (0..1) relative to the rendered image.
 */

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
  labelOffset = 100, // horizontal offset in px for label box
  className,
  imgStyle,
  labelStyle,
  lineColor = "black",
  lineWidth = 3,
}) {
  const [hideLabels, setHideLabels] = useState(false);
  const imgRef = useRef(null);
  const [box, setBox] = useState({ w: 0, h: 0 });

  useLayoutEffect(() => {
    function update() {
      const r = imgRef.current?.getBoundingClientRect();
      if (r) setBox({ w: r.width, h: r.height });
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const keys = useMemo(() => (Array.isArray(show) && show.length ? show : Object.keys(anchors || {})), [show, anchors]);

  return (
    <div className={className} style={{ position: "relative", display: "inline-block" }}>
      <Button appearance='primary' onClick={() => setHideLabels(!hideLabels)}>
        {hideLabels ? "Show Labels" : "Hide Labels"}
      </Button>

      <img
        ref={imgRef}
        src={src}
        alt=''
        style={{ width: "100%", height: "auto", display: "block", ...(imgStyle || {}), marginTop: "1rem" }}
        onLoad={() => {
          const r = imgRef.current?.getBoundingClientRect();
          if (r) setBox({ w: r.width, h: r.height });
        }}
      />

      {/* SVG lines */}
      {!hideLabels && callouts && (
        <svg viewBox={`0 0 ${box.w || 1} ${box.h || 1}`} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {keys.map((k) => {
            const a = anchors[k];
            if (!a) return null;
            const ax = a.x * box.w;
            const ay = a.y * box.h;

            const toRight = a.x <= 0.55; // place label on the side opposite the anchor’s half
            const dx = toRight ? 100 : -100;
            const dy = a.y < 0.25 ? -30 : a.y > 0.8 ? -10 : -12;

            const lx = clamp(ax + dx, 8, box.w - 8);
            const ly = clamp(ay + dy, 8, box.h - 8);

            const elbowX = ax + (toRight ? 40 : -40);
            const elbowY = ay;

            console.log({ k, ax, ay, lx, ly, elbowX, elbowY });

            return (
              <g key={`line-${k}`}>
                {dot && <circle cx={ax} cy={ay} r='6' fill={lineColor} />}
                <line x1={ax} y1={ay} x2={elbowX} y2={elbowY} stroke={lineColor} strokeWidth={lineWidth} strokeLinecap='round' />
                <line x1={elbowX} y1={elbowY} x2={toRight ? lx - 8 : lx + 8} y2={ly} stroke={lineColor} strokeWidth={lineWidth} strokeLinecap='round' />
              </g>
            );
          })}
        </svg>
      )}

      {/* Label boxes */}
      {!hideLabels && (
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {keys.map((k) => {
            const a = anchors[k];
            if (!a) return null;

            const ax = a.x * box.w;
            const ay = a.y * box.h;

            const toRight = a.x <= 0.55;
            const dx = toRight ? labelOffset : -labelOffset;
            const dy = a.y < 0.25 ? -30 : a.y > 0.8 ? -10 : -12;

            const lx = clamp(ax + dx, 8, box.w - 8);
            const ly = clamp(ay + dy, 8, box.h - 8);

            return (
              <div
                key={`label-${k}`}
                style={{
                  position: "absolute",
                  left: lx,
                  top: ly,
                  transform: "translate(-50%, -50%)",
                  background: "rgba(0,0,0,0.78)",
                  color: "#fff",
                  padding: "6px 12px",
                  borderRadius: 10,
                  font: "16px/1.2 system-ui, sans-serif",
                  textTransform: "capitalize",
                  pointerEvents: "auto",
                  ...(labelStyle || {}),
                }}
              >
                {labelFormatter ? labelFormatter(k) : k}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
