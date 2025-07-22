import React from "react";

export function Table(props: React.TableHTMLAttributes<HTMLTableElement>) {
  return <table {...props}>{props.children}</table>;
}

export default Table;
