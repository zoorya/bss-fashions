import React from "react";

type Props = {
  cartCount: number;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
};

export default function Header({ cartCount, searchQuery, setSearchQuery }: Props) {
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(255,250,242,0.92)", backdropFilter: "blur(6px)", borderBottom: "1px solid #eee" }}>
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 1120, margin: "0 auto", padding: "12px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <a href="#" style={{ fontWeight: 700, color: "#444", fontSize: 16, letterSpacing: 1, textDecoration: "none", textTransform: "uppercase" }}>Home</a>
          <a href="#" style={{ fontWeight: 500, color: "#666", fontSize: 15, textDecoration: "none" }}>Shop</a>
          <a href="#" style={{ fontWeight: 500, color: "#666", fontSize: 15, textDecoration: "none" }}>About</a>
          <a href="#" style={{ fontWeight: 500, color: "#666", fontSize: 15, textDecoration: "none" }}>Contact</a>
        </div>
        <h1 style={{ fontFamily: 'Space Grotesk, Inter, sans-serif', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.2, fontSize: 'clamp(2.2rem, 7vw, 2.8rem)', backgroundImage: 'url(/images/fabric-texture.jpg), linear-gradient(90deg, #222 60%, #888 100%)', backgroundSize: 'cover', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent', WebkitTextFillColor: 'transparent', margin: 0, lineHeight: 1, padding: 0 }}>BSS FASHION</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ background: "#f5f5f5", borderRadius: 8, padding: "4px 10px", display: "flex", alignItems: "center", gap: 6 }}>
            <span aria-hidden>🔍</span>
            <input
              aria-label="Search products"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search..."
              style={{ border: "none", background: "transparent", outline: "none", fontSize: 15, minWidth: 100 }}
            />
          </div>
          <button style={{ background: "none", border: "none", position: "relative", cursor: "pointer", fontSize: 22, color: "#444" }} aria-label="Cart">
            🛒
            {cartCount > 0 && (
              <span style={{ position: "absolute", top: -6, right: -10, background: "#007bff", color: "#fff", borderRadius: 999, padding: "2px 7px", fontSize: 12, fontWeight: 700 }}>{cartCount}</span>
            )}
          </button>
        </div>
      </nav>
    </header>
  );
}
