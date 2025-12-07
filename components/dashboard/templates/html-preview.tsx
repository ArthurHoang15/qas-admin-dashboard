"use client";

interface HtmlPreviewProps {
  html: string;
  className?: string;
}

export function HtmlPreview({ html, className = "" }: HtmlPreviewProps) {
  return (
    <div className={`relative rounded-lg border border-border bg-white overflow-hidden ${className}`}>
      <div className="absolute top-0 left-0 right-0 h-8 bg-muted border-b border-border flex items-center px-3 gap-1.5">
        <div className="w-3 h-3 rounded-full bg-red-400" />
        <div className="w-3 h-3 rounded-full bg-yellow-400" />
        <div className="w-3 h-3 rounded-full bg-green-400" />
        <span className="ml-2 text-xs text-muted-foreground">Preview</span>
      </div>
      <iframe
        srcDoc={html || "<p style='color: #666; padding: 20px;'>Enter HTML content to see preview...</p>"}
        className="w-full h-full pt-8"
        sandbox="allow-same-origin"
        title="HTML Preview"
        style={{ minHeight: "400px" }}
      />
    </div>
  );
}
