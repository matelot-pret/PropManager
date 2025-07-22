import React from "react";

export function Card({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      style={{
        border: "1px solid #eee",
        borderRadius: 8,
        padding: 16,
        margin: 8,
        ...props.style,
      }}
    >
      {children}
    </div>
  );
}

export default Card;

export function CardContent({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} style={{ padding: 8, ...props.style }}>
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      style={{ borderBottom: "1px solid #eee", padding: 8, ...props.style }}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <h3
      {...props}
      style={{ fontWeight: 700, fontSize: 18, margin: 0, ...props.style }}
    >
      {children}
    </h3>
  );
}
