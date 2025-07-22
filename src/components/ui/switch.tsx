import React from "react";

export function Switch(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input type="checkbox" {...props} />;
}

export default Switch;
