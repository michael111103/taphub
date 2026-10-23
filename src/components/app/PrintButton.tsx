"use client";

import Icon from "./Icon";

export default function PrintButton({ label = "Print" }: { label?: string }) {
  return (
    <button type="button" onClick={() => window.print()} className="btn-soft">
      <Icon name="print" size={16} /> {label}
    </button>
  );
}
