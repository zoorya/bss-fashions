import React, { useEffect, useMemo, useRef, useState } from "react";
import MarqueeHeader from "./MarqueeHeader";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  sizes?: string[];
  description?: string;
  allImages?: string[];
};

type ProductCategory = {
  name: string;
  price: number;
  description?: string;
  sizes?: string[];
  products: Product[];
};

const productCategories: ProductCategory[] = [
  {
    name: "Contrast T-Shirt",
    price: 999,
    sizes: ["M", "L", "XL"],
    description:
      "Vintage Contrast T-Shirt — premium cotton blend with bold contrast panels. Clean, rare, and easy to style.",
    products: Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      name: `Contrast T-Shirt - View ${i + 1}`,
      category: "Contrast T-Shirt",
      price: 999,
      image: `/contrast-tshirt-${i + 1}.jpg`,
      sizes: ["M", "L", "XL"],
      description: "Vintage Contrast T-Shirt — excellent condition.",
      allImages: [`/contrast-tshirt-${i + 1}.jpg`],
    })),
  },
  {
    name: "Faux Jacket",
    price: 2499,
    sizes: ["L", "XL"],
    description:
      "Classic faux leather jacket — warm lining, strong silhouette, and a timeless BSS FASHION staple.",
    products: Array.from({ length: 14 }, (_, i) => ({
      id: 100 + i + 1,
      name: `Faux Jacket - View ${i + 1}`,
      category: "Faux Jacket",
      price: 2499,
      image: `/faux-jacket-${i + 1}.jpg`,
      sizes: ["L", "XL"],
      description: "Classic faux jacket — excellent condition.",
      allImages: [`/faux-jacket-${i + 1}.jpg`],
    })),
  },
  {
    name: "Shoes",
    price: 2999,
    sizes: ["UK 43", "UK 44", "UK 45"],
    description:
      "Vintage footwear — solid build, clean finish, and ready for daily wear.",
    products: Array.from({ length: 32 }, (_, i) => ({
      id: 200 + i + 1,
      name: `Shoes - View ${i + 1}`,
      category: "Shoes",
      price: 2999,
      image: `/shoes-${i + 1}.jpg`,
      sizes: ["UK 43", "UK 44", "UK 45"],
      description: "Vintage shoes — excellent condition.",
      allImages: [`/shoes-${i + 1}.jpg`],
    })),
  },
  {
    name: "Tote Bag",
    price: 1999,
    products: Array.from({ length: 28 }, (_, i) => ({
      id: 300 + i + 1,
      name: `Tote Bag - View ${i + 1}`,
      category: "Tote Bag",
      price: 1999,
      image: `/tote-bag-${i + 1}.jpg`,
      allImages: [`/tote-bag-${i + 1}.jpg`],
      description: "Everyday tote — clean, roomy, and easy styling.",
    })),
  },
];

type CartItem = Product & { quantity: number; selectedSize?: string };

function getTagForProduct(product: Product) {
  if (product.category.includes("Jacket")) return ["Premium", "Vintage"];
  if (product.category.includes("Shoes")) return ["Rare", "Vintage"];
  if (product.category.includes("Tote")) return ["Classic", "Vintage"];
  return ["Vintage", "Last piece"];
}

function cartKeyOf(id: number, selectedSize?: string) {
  return `${id}-${selectedSize || ""}`;
}

const styles = {
  card: {
    padding: 14,
    cursor: "pointer",
    background: "white",
  },
  button: {
    width: "100%",
    marginTop: 12,
    borderRadius: 12,
    padding: "10px 12px",
  },
};

export default function ThriftStore() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [mobileCartOpen, setMobileCartOpen] = useState(false);

  const shopRef = useRef<HTMLDivElement | null>(null);

  const addToCart = (product: Product, size?: string) => {
    const cartKey = `${product.id}-${size || ""}`;
    setCart((prev) => {
      const existing = prev.find(
        (item) => `${item.id}-${item.selectedSize || ""}` === cartKey
      );
      if (existing) {
        return prev.map((item) =>
          `${item.id}-${item.selectedSize || ""}` === cartKey
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1, selectedSize: size }];
    });

    setSelectedProduct(null);
    setSelectedSize("");
  };

  const removeFromCart = (productId: number, selectedSize?: string) => {
    setCart((prev) =>
      prev.filter((item) => !(item.id === productId && item.selectedSize === selectedSize))
    );
  };

  const updateQuantity = (productId: number, selectedSize: string | undefined, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedSize);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId && item.selectedSize === selectedSize
          ? { ...item, quantity }
          : item
      )
    );
  };

  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );
  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const filteredCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return productCategories
      .map((category) => ({
        ...category,
        products: category.products.filter((product) => {
          if (!q) return true;
          return (
            product.name.toLowerCase().includes(q) ||
            category.name.toLowerCase().includes(q)
          );
        }),
      }))
      .filter(
        (category) =>
          category.products.length > 0 &&
          (selectedCategory === "" || category.name === selectedCategory)
      );
  }, [searchQuery, selectedCategory]);

  const totalProducts = useMemo(
    () => productCategories.reduce((sum, c) => sum + c.products.length, 0),
    []
  );

  const scrollToShop = () => {
    shopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedProduct(null);
        setMobileCartOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const CartBody = ({ compact }: { compact?: boolean }) => (
    <>
      <div className="cartHead">
        <h3>Cart</h3>
        <div className="cartCount">{cartCount} item{cartCount === 1 ? "" : "s"}</div>
      </div>

      {cart.length === 0 ? (
        <div className="empty">
          <div style={{ fontWeight: 1000, marginBottom: 6 }}>Your cart is empty</div>
          <div style={{ marginBottom: 12 }}>Add a piece you love — vintage goes fast.</div>
          <button
            className="btn btnPrimary"
            style={{ width: compact ? "100%" : "auto" }}
            onClick={() => {
              setMobileCartOpen(false);
              scrollToShop();
            }}
          >
            Browse best sellers
          </button>
        </div>
      ) : (
        <>
          <div className="cartList" aria-label="Cart items">
            {cart.map((item) => (
              <div
                key={`${item.id}-${item.selectedSize || ""}`}
                className="cartItem"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  onError={e => (e.currentTarget.src = "https://via.placeholder.com/56x56?text=No+Image")}
                />
                <div className="cartMeta">
                  <div className="cartName" title={item.name}>
                    {item.category}
                    {item.selectedSize ? ` — ${item.selectedSize}` : ""}
                  </div>
                  <div className="cartSub">₹{item.price} each</div>
                  <div className="qtyRow">
                    <button
                      className="qtyBtn"
                      onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <div className="qty" aria-label="Quantity">
                      {item.quantity}
                    </div>
                    <button
                      className="qtyBtn"
                      onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="cartRight">
                  <div style={{ fontWeight: 1000 }}>
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                  <button
                    className="remove"
                    onClick={() => removeFromCart(item.id, item.selectedSize)}
                    aria-label="Remove item"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="totalRow" aria-label="Cart total">
            <span>Total</span>
            <span>₹{cartTotal.toFixed(2)}</span>
          </div>

          <button className="btn btnPrimary checkout" onClick={() => alert("Checkout coming soon ✨")}>
            Checkout
          </button>
        </>
      )}
    </>
  );

  return (
    <div className="grain" style={{ minHeight: '100vh', width: '100vw', maxWidth: '100vw', overflowX: 'clip' }}>
      {/* MarqueeHeader always visible at the top */}
      <MarqueeHeader />
      {/* Floating cart removed as requested */}
      {/* Header */}
      <div className="header-wrapper">
        {/* Utility Bar removed from top as requested */}
        {/* Main Navigation with Gemini Image */}
        <div className="main-nav">
         
          <div style={{ width: "100vw", maxWidth: "100vw", overflow: "hidden", borderRadius: 0, marginBottom: 0, position: "relative", left: "50%", right: "50%", marginLeft: "-50vw", marginRight: "-50vw" }}>
            <img
              src="/Gemini_Generated_Image_fn600zfn600zfn60.png"
              alt="BSS FASHION Banner"
              style={{
                width: "100vw",
                height: 320,
                objectFit: "cover",
                display: "block",
                borderRadius: 0,
                boxShadow: "0 8px 32px rgba(121, 95, 79, 0.12)",
                background: "#fffaf2",
                border: "none"
              }}
            />
          </div>
        </div>
      </div>
      {/* Trending Products Section (marquee style) */}
      <div style={{
        background: "rgba(199, 125, 79, 0.10)",
        padding: "32px 0 40px 0",
        margin: "48px auto 0 auto",
        borderRadius: 16,
        maxWidth: '100vw',
        boxShadow: "0 4px 24px rgba(31,26,23,.08)",
        overflow: 'hidden',
        position: 'relative',
      }}>
        <h2 style={{ fontSize: 28, marginBottom: 8, color: '#c77d4f', fontWeight: 900, letterSpacing: 1.1, textAlign: 'center' }}>🔥 Trending Products</h2>
        <p style={{ color: "var(--muted)", marginBottom: 24, textAlign: 'center' }}>Top picks from each collection, updated regularly</p>
        <div style={{
          width: '100vw',
          overflow: 'hidden',
          position: 'relative',
        }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              animation: 'trending-marquee 25s linear infinite',
              willChange: 'transform',
            }}
          >
            {(() => {
              // Gather trending products (2 from each category + 4 shoes)
              const trending = [
                ...productCategories.flatMap((category) => category.products.slice(0, 2)),
                ...productCategories.find(c => c.name === 'Shoes')?.products.slice(2, 6) || []
              ];
              // Duplicate for infinite loop effect
              const marqueeProducts = [...trending, ...trending];
              return marqueeProducts.map((product, idx) => {
                const category = productCategories.find(c => c.name === product.category) || productCategories[0];
                return (
                  <div
                    key={product.id + '-' + idx}
                    className="card"
                    style={{
                      minWidth: 140,
                      maxWidth: 160,
                      padding: 10,
                      cursor: "pointer",
                      background: "#fffaf2",
                      borderRadius: 14,
                      boxShadow: "0 2px 8px rgba(31,26,23,.06)",
                      border: "1px solid rgba(31,26,23,.10)",
                      transition: "transform .15s, box-shadow .15s",
                      flex: '0 0 auto',
                    }}
                    onClick={() => {
                      setSelectedProduct(product);
                      setSelectedSize(category.sizes?.[0] || "");
                    }}
                  >
                    <div
                      style={{
                        borderRadius: 12,
                        overflow: "hidden",
                        border: "1px solid rgba(31,26,23,.10)",
                        background: "rgba(31,26,23,.03)",
                      }}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{ width: "100%", height: 160, objectFit: "cover" }}
                      />
                    </div>
                    <div style={{ marginTop: 10 }}>
                      <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 4 }}>
                        {category.name}
                      </div>
                      <div style={{ fontWeight: 800, fontSize: 18 }}>₹{product.price}</div>
                    </div>
                    <button
                      className="btn btn-primary"
                      type="button"
                      style={{
                        width: "100%",
                        marginTop: 10,
                        borderRadius: 12,
                        padding: "10px 12px",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(product);
                        setSelectedSize(category.sizes?.[0] || "");
                      }}
                    >
                      Quick View
                    </button>
                  </div>
                );
              });
            })()}
          </div>
          <style>{`
            @keyframes trending-marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
          `}</style>
        </div>
      </div>
      
      {/* Hero */}
      <div className="container" style={{ width: '100%', maxWidth: '100%', padding: 0 }}>
        <div className="hero">
          <div className="hero-inner">
            <div className="hero-grid">
              <div>
                <div className="kicker">✨ Limited drops • Premium picks</div>
                <h1>DISCOVER TIMELESS BSS FASHION PIECES.</h1>
                <p>
                  Handpicked vintage pieces with a warm, premium feel. Browse by category, open any
                  product view, choose size, and add to cart in seconds.
                </p>

                <div className="hero-ctas">
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => {
                      const el = document.getElementById("shop");
                      el?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                  >
                    Shop now
                  </button>
                  <button
                    className="btn btn-ghost"
                    type="button"
                    onClick={() => setSelectedCategory("")}
                  >
                    View all categories
                  </button>
                </div>
              </div>

              <div className="hero-card">
                <h3>Today's highlights</h3>
                <div className="stat">
                  <span>Categories</span>
                  <strong>{productCategories.length}</strong>
                </div>
                <div className="stat">
                  <span>Total views</span>
                  <strong>
                    {productCategories.reduce((sum, c) => sum + c.products.length, 0)}
                  </strong>
                </div>
                <div className="stat">
                  <span>Cart items</span>
                  <strong>{cartCount}</strong>
                </div>

                <div className="badges">
                  <span className="badge">Fast UI</span>
                  <span className="badge">Warm vintage</span>
                  <span className="badge">Premium touch</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature cards */}
        <div className="section" style={{ width: '100%', maxWidth: '100%', padding: 0 }}>
          <div className="grid">
            <div className="card">
              <div className="emoji">🧵</div>
              <h3>Curated quality</h3>
              <p>Only pieces that feel premium. Clean, classic and ready to wear.</p>
            </div>
            <div className="card">
              <div className="emoji">🧡</div>
              <h3>Warm aesthetic</h3>
              <p>Soft paper background, leather tones, and smooth subtle shadows.</p>
            </div>
            <div className="card">
              <div className="emoji">⚡</div>
              <h3>Quick checkout</h3>
              <p>Pick size, add to cart, update quantities—everything stays simple.</p>
            </div>
          </div>
        </div>

        {/* Shop */}
        <div id="shop" className="section" style={{ width: '100%', maxWidth: '100%', padding: 0 }}>
          <div className="section-title">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 10 }}>
                <button
                  className="btn"
                  type="button"
                  style={{
                    background: selectedCategory === "" ? "var(--ink)" : "rgba(255,250,242,.92)",
                    color: selectedCategory === "" ? "#fffaf2" : "var(--ink)",
                    border: "1px solid rgba(31,26,23,.12)",
                    boxShadow: "0 10px 20px rgba(31,26,23,.08)",
                    minWidth: 120,
                    fontWeight: 700
                  }}
                  onClick={() => setSelectedCategory("")}
                >
                  All Products
                </button>
                {productCategories.map((cat) => (
                  <button
                    key={cat.name}
                    className="btn"
                    type="button"
                    style={{
                      background:
                        selectedCategory === cat.name ? "var(--ink)" : "rgba(255,250,242,.92)",
                      color: selectedCategory === cat.name ? "#fffaf2" : "var(--ink)",
                      border: "1px solid rgba(31,26,23,.12)",
                      boxShadow: "0 10px 20px rgba(31,26,23,.06)",
                      minWidth: 120,
                      fontWeight: 700
                    }}
                    onClick={() => setSelectedCategory((prev) => (prev === cat.name ? "" : cat.name))}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 340px",
              gap: 16,
              alignItems: "start"
            }}
          >
            {/* Products */}
            <div>
              {filteredCategories.length === 0 ? (
                <div className="card" style={{ textAlign: "center" }}>
                  <h3 style={{ marginTop: 0 }}>No products found</h3>
                  <p>Try another keyword or clear filters.</p>
                </div>
              ) : (
                filteredCategories.map((category) => (
                  <div
                    key={category.name}
                    style={{
                      marginBottom: 24,
                      boxSizing: 'border-box',
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
                      <img
                        src="/Gemini_Generated_Image_fn600zfn600zfn60.png"
                        alt="Category Banner"
                        style={{
                          width: 60,
                          height: 60,
                          objectFit: "cover",
                          borderRadius: 12,
                          boxShadow: "0 2px 8px rgba(31,26,23,.10)",
                          background: "#fffaf2",
                          border: "1px solid rgba(31,26,23,.10)"
                        }}
                      />
                      <div>
                        <h2 style={{ margin: 0 }}>{category.name}</h2>
                        <p style={{ margin: 0, color: "var(--muted)" }}>
                          ₹{category.price} each • {category.products.length} views available
                        </p>
                      </div>
                    </div>
                    <div
                      style={{
                        marginTop: 10,
                        height: 1,
                        background: "rgba(31,26,23,.12)",
                      }}
                    />

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                        gap: 14,
                      }}
                    >
                      {category.products.map((product) => (
                        <div
                          key={product.id}
                          className="card"
                          style={{ padding: 12, cursor: "pointer" }}
                          onClick={() => {
                            setSelectedProduct(product);
                            setSelectedSize(category.sizes?.[0] || "");
                          }}
                        >
                          <div
                            style={{
                              borderRadius: 14,
                              overflow: "hidden",
                              border: "1px solid rgba(31,26,23,.10)",
                              background: "rgba(31,26,23,.03)",
                            }}
                          >
                            <img
                              src={product.image}
                              alt={product.name}
                              style={{ width: "100%", height: 160, objectFit: "cover" }}
                            />
                          </div>

                          <div style={{ marginTop: 10, fontWeight: 800 }}>₹{product.price}</div>

                          <button
                            className="btn btn-primary"
                            type="button"
                            style={{
                              width: "100%",
                              marginTop: 10,
                              borderRadius: 12,
                              padding: "10px 12px",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProduct(product);
                              setSelectedSize(category.sizes?.[0] || "");
                            }}
                          >
                            View
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart */}
            <div className="card" style={{ position: "sticky", top: 86 }}>
              <h3 style={{ marginTop: 0 }}>🛒 Cart ({cartCount})</h3>

              {cart.length === 0 ? (
                <p style={{ color: "var(--muted)" }}>Your cart is empty.</p>
              ) : (
                <>
                  <div style={{ maxHeight: 420, overflowY: "auto", paddingRight: 6 }}>
                    {cart.map((item) => (
                      <div
                        key={cartKeyOf(item.id, item.selectedSize)}
                        style={{
                          display: "flex",
                          gap: 10,
                          padding: "12px 0",
                          borderBottom: "1px solid rgba(31,26,23,.10)",
                        }}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{
                            width: 60,
                            height: 60,
                            objectFit: "cover",
                            borderRadius: 12,
                            border: "1px solid rgba(31,26,23,.10)",
                          }}
                        />

                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: 13 }}>
                            {item.name}
                            {item.selectedSize ? (
                              <span style={{ color: "var(--muted)" }}> • {item.selectedSize}</span>
                            ) : null}
                          </div>
                          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
                            ₹{item.price} each
                          </div>

                          <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 10 }}>
                            <button
                              className="icon-btn"
                              type="button"
                              onClick={() =>
                                updateQuantity(item.id, item.selectedSize, item.quantity - 1)
                              }
                            >
                              −
                            </button>
                            <strong style={{ minWidth: 24, textAlign: "center" }}>
                              {item.quantity}
                            </strong>
                            <button
                              className="icon-btn"
                              type="button"
                              onClick={() =>
                                updateQuantity(item.id, item.selectedSize, item.quantity + 1)
                              }
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontWeight: 800 }}>
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </div>
                          <button
                            className="btn"
                            type="button"
                            style={{
                              marginTop: 10,
                              padding: "8px 10px",
                              borderRadius: 12,
                              background: "rgba(31,26,23,.06)",
                              border: "1px solid rgba(31,26,23,.10)",
                            }}
                            onClick={() => removeFromCart(item.id, item.selectedSize)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: 14, borderTop: "1px solid rgba(31,26,23,.10)", paddingTop: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 900 }}>
                      <span>Total</span>
                      <span>₹{cartTotal.toFixed(2)}</span>
                    </div>

                    <button
                      className="btn btn-primary"
                      type="button"
                      style={{ width: "100%", marginTop: 12 }}
                    >
                      Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Modal */}
        {selectedProduct && (
          <div
            className="modal-backdrop"
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,.55)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 14,
              zIndex: 1000,
            }}
            onClick={() => setSelectedProduct(null)}
          >
            <div
              className="modal-content"
              style={{
                width: "min(860px, 92vw)",
                maxHeight: "86vh",
                overflowY: "auto",
                borderRadius: 18,
                background: "var(--paper)",
                border: "1px solid rgba(31,26,23,.12)",
                boxShadow: "0 25px 50px rgba(0,0,0,.35)",
                padding: 18,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <h2 style={{ margin: 0 }}>{selectedProduct.category}</h2>
                  <p style={{ margin: "6px 0 0", color: "var(--muted)" }}>
                    {selectedProduct.description ||
                      `Premium quality ${selectedProduct.category} - Excellent Condition`}
                  </p>
                </div>

                <button className="icon-btn" type="button" onClick={() => setSelectedProduct(null)}>
                  ✕
                </button>
              </div>

              <div style={{ marginTop: 14 }}>
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  style={{
                    width: "100%",
                    height: 420,
                    objectFit: "contain",
                    borderRadius: 16,
                    background: "rgba(31,26,23,.04)",
                    border: "1px solid rgba(31,26,23,.10)",
                  }}
                />

                {selectedProduct.allImages?.length ? (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(6, 1fr)",
                      gap: 10,
                      marginTop: 10,
                    }}
                  >
                    {selectedProduct.allImages.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`View ${idx + 1}`}
                        onClick={() => setSelectedProduct({ ...selectedProduct, image: img })}
                        style={{
                          width: "100%",
                          height: 70,
                          objectFit: "cover",
                          borderRadius: 12,
                          cursor: "pointer",
                          border:
                            selectedProduct.image === img
                              ? "2px solid var(--brand)"
                              : "1px solid rgba(31,26,23,.10)",
                        }}
                      />
                    ))}
                  </div>
                ) : null}
              </div>

              <div style={{ marginTop: 14, fontSize: 26, fontWeight: 900 }}>
                ₹{selectedProduct.price}
              </div>

              {selectedProduct.sizes?.length ? (
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontWeight: 800, marginBottom: 10 }}>Select size</div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {selectedProduct.sizes.map((size) => (
                      <button
                        key={size}
                        className="btn"
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        style={{
                          background: selectedSize === size ? "var(--ink)" : "rgba(255,250,242,.92)",
                          color: selectedSize === size ? "#fffaf2" : "var(--ink)",
                          border: "1px solid rgba(31,26,23,.12)",
                          borderRadius: 14,
                          padding: "10px 14px",
                        }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              <button
                className="btn btn-primary"
                type="button"
                style={{ width: "100%", marginTop: 16 }}
                onClick={() => addToCart(selectedProduct, selectedSize)}
              >
                ✓ Add to Cart
              </button>

              <p style={{ marginTop: 10, color: "var(--muted)", fontSize: 13 }}>
                Tip: these are limited pieces. If you like it, grab it now.
              </p>
            </div>
          </div>
        )}

        {/* Bulk Order Message */}
        <div style={{
          margin: "48px auto 0 auto",
          padding: "32px 36px 28px 36px",
          background: "linear-gradient(135deg, #fffaf2 60%, #f5e9da 100%)",
          color: "#0a2342",
          borderRadius: 18,
          maxWidth: 720,
          fontSize: 17,
          fontWeight: 500,
          textAlign: "center",
          lineHeight: 1.7,
          boxShadow: "0 8px 32px rgba(199,125,79,0.10), 0 2px 8px rgba(31,26,23,0.08)",
          border: "1.5px solid #e7d3b8",
          position: "relative"
        }}>
          <div style={{
            fontFamily: 'serif',
            fontWeight: 900,
            fontSize: 28,
            color: '#c77d4f',
            marginBottom: 10,
            letterSpacing: 1.2
          }}>
            Bulk Orders & Corporate Gifting
          </div>
          <div style={{ fontSize: 17, color: '#6e5b4f', marginBottom: 18 }}>
            Planning an event, business giveaway, or group order? We offer exclusive rates and personalized service for bulk requests.
          </div>
          <ul style={{
            textAlign: 'left',
            maxWidth: 540,
            margin: '0 auto 18px auto',
            color: '#0a2342',
            fontSize: 16,
            lineHeight: 1.6,
            paddingLeft: 24
          }}>
            <li>Minimum order: 200 pieces</li>
            <li>Custom packaging and handwritten notes</li>
            <li>Fast, reliable delivery for large orders</li>
            <li>Personalized curation for your theme or brand</li>
            <li>Dedicated support from our team</li>
          </ul>
          <div style={{ fontSize: 16, color: '#8a4b2a', marginBottom: 10 }}>
            Email us at <a href="mailto:bssfashion.official@gmail.com" style={{ color: '#c77d4f', fontWeight: 700, textDecoration: 'underline' }}>bssfashion.official@gmail.com</a> or call <a href="tel:8089099710" style={{ color: '#c77d4f', fontWeight: 700, textDecoration: 'underline' }}>8089099710</a> to get started.
          </div>
          <div style={{ fontSize: 15, color: '#6e5b4f' }}>
            Let us help you make your next event or gifting experience truly memorable!
          </div>
        </div>
        {/* Utility Bar moved to bottom */}
        <div className="utility-bar" style={{
          width: '100%',
          background: 'rgba(31,26,23,.04)',
          borderTop: '1px solid rgba(31,26,23,.10)',
          padding: '18px 0',
          marginTop: 40,
          display: 'flex',
          justifyContent: 'center',
          gap: 32,
          flexWrap: 'wrap',
          fontSize: 16
        }}>
          <div style={{ display: 'flex', gap: 18 }}>
            <a href="#" className="utility-link" style={{ color: '#0a2342', textDecoration: 'none', fontWeight: 700 }}>Account</a>
            <a href="#" className="utility-link" style={{ color: '#0a2342', textDecoration: 'none', fontWeight: 700 }}>Gift Voucher</a>
          </div>
          <div style={{ display: 'flex', gap: 18 }}>
            <a href="#" className="utility-link" style={{ color: '#0a2342', textDecoration: 'none', fontWeight: 700 }}>Help</a>
            <a href="#" className="utility-link" style={{ color: '#0a2342', textDecoration: 'none', fontWeight: 700 }}>Track Order</a>
          </div>
        </div>
        <div className="footer">
          © {new Date().getFullYear()} BSS FASHION — all rights reserved.
        </div>
      </div>
    </div>
  );
}

