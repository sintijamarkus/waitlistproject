"use client";

import { useState } from "react";

export default function CopyLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex gap-2">
      <input readOnly value={url} className="flex-1 rounded border border-neutral-600 bg-transparent px-2 py-1 text-sm" />
      <button
        onClick={async () => {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
        className="rounded bg-neutral-700 px-3 py-1 text-sm hover:bg-neutral-600"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}
