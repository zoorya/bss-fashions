import React from "react";

export default function MarqueeHeader() {
  return (
    <div style={{
      width: "100vw",
      overflow: "hidden",
      background: "#fffaf2",
      borderBottom: "1px solid rgba(31,26,23,.10)",
      position: "relative",
      zIndex: 1001,
      height: 38,
      display: "flex",
      alignItems: "center"
    }}>
      <div className="marquee-track" style={{
        display: "inline-block",
        whiteSpace: "nowrap",
        animation: "marquee 8s linear infinite",
        fontWeight: 700,
        fontSize: 15,
        color: "#0a2342",
        letterSpacing: 1.2,
      }}>
        BF &nbsp;•&nbsp; BSS FASHION &nbsp;•&nbsp; Warm vintage • curated drops &nbsp;•&nbsp; New Arrivals &nbsp;•&nbsp; Men &nbsp;•&nbsp; Women &nbsp;•&nbsp; Accessories &nbsp;•&nbsp; Sale &nbsp;•&nbsp;
        BF &nbsp;•&nbsp; BSS FASHION &nbsp;•&nbsp; Warm vintage • curated drops &nbsp;•&nbsp; New Arrivals &nbsp;•&nbsp; Men &nbsp;•&nbsp; Women &nbsp;•&nbsp; Accessories &nbsp;•&nbsp; Sale &nbsp;•&nbsp;
      </div>
      <h1 className="classy-heading">Your Elegant Title Here</h1>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}
