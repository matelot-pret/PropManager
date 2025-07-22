import React from "react";

export function Badge({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      style={{
        background: "#e0e7ff",
        color: "#3730a3",
        borderRadius: 8,
        padding: "2px 8px",
        fontSize: 12,
        ...props.style,
      }}
    >
      {children}
    </span>
  );
}

export default Badge;
