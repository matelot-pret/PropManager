import React from "react";

export function Skeleton({ width = 100, height = 20 }: { width?: number; height?: number }) {
  return (
    <div
      style={{ background: "#eee", borderRadius: 4, width, height, margin: 4 }}
    />
  );
}

export default Skeleton;
