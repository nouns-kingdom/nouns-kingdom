import React from "react";
import ImageLabelOverlay from "../helperFunctions/ImageLabelOverlay";

// Horse anchors (normalized). Replace with any anchors for other images.
const horseAnchors = {
  ear: { x: 0.43, y: 0.1 }, // top ear
  eye: { x: 0.32, y: 0.33 }, // main eye
  nose: { x: 0.24, y: 0.41 }, // nose / muzzle
  mouth: { x: 0.25, y: 0.49 }, // smiling mouth
  neck: { x: 0.4, y: 0.46 }, // where head joins body
  mane: { x: 0.45, y: 0.36 }, // front mane
  body: { x: 0.45, y: 0.58 }, // center of body
  leg: { x: 0.55, y: 0.8 }, // front leg
  hoof: { x: 0.5, y: 0.95 }, // front hoof
  tail: { x: 0.75, y: 0.45 }, // tail
};

export default function Horse() {
  return (
    <div style={{ maxWidth: 1000, margin: "40px auto" }}>
      <h2>Horse</h2>
      <ImageLabelOverlay src={`${process.env.PUBLIC_URL}/assets/animals_horse.png`} anchors={horseAnchors} />

      {/* <h2 style={{ marginTop: 48 }}>Only Tail & Mane (subset)</h2>
      <ImageLabelOverlay src='/images/horse-1920x1080.png' anchors={horseAnchors} show={["tail", "mane"]} />

      <h2 style={{ marginTop: 48 }}>Custom look</h2>
      <ImageLabelOverlay
        src='/images/horse-1920x1080.png'
        anchors={horseAnchors}
        lineColor='#444'
        lineWidth={2}
        labelStyle={{ background: "#1e293b", borderRadius: 12, fontSize: 14 }}
        labelOffset={140}
        labelFormatter={(k) => k.toUpperCase()} // e.g. "TAIL"
      /> */}
    </div>
  );
}
