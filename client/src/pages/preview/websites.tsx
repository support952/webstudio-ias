import { useState, useCallback } from "react";
import { useI18n } from "@/lib/i18n";
import { Layout, Zap, Globe, ShoppingCart, Star, X, Minus, Plus, Check, Send, Building2, Briefcase, MessageSquare } from "lucide-react";
import { SEOHead } from "@/components/seo-head";
import { PreviewPageControls } from "@/components/preview-page-controls";
import { useTheme } from "@/lib/theme";

const PRODUCTS = [
  { id: "1", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=400&fit=crop", keyName: "product1", keyDesc: "product1Desc", price: "$99", priceNum: 99, badge: "Popular" },
  { id: "2", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=400&fit=crop", keyName: "product2", keyDesc: "product2Desc", price: "$49", priceNum: 49, badge: null },
  { id: "3", img: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=400&fit=crop", keyName: "product3", keyDesc: "product3Desc", price: "$149", priceNum: 149, badge: "Best value" },
  { id: "4", img: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&h=400&fit=crop", keyName: "product4", keyDesc: "product4Desc", price: "$79", priceNum: 79, badge: null },
  { id: "5", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=400&fit=crop", keyName: "product5", keyDesc: "product5Desc", price: "$129", priceNum: 129, badge: "New" },
  { id: "6", img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&h=400&fit=crop", keyName: "product6", keyDesc: "product6Desc", price: "$199", priceNum: 199, badge: null },
] as const;

type CartItem = {
  id: string;
  keyName: string;
  price: string;
  priceNum: number;
  img: string;
  quantity: number;
};

export default function PreviewWebsites() {
  const { t } = useI18n();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [showCheckoutMessage, setShowCheckoutMessage] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSuccess, setContactSuccess] = useState(false);

  const addToCart = useCallback((p: (typeof PRODUCTS)[number]) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === p.id);
      if (existing) {
        return prev.map((i) => (i.id === p.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { id: p.id, keyName: p.keyName, price: p.price, priceNum: p.priceNum, img: p.img, quantity: 1 }];
    });
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1500);
  }, []);

  const updateQuantity = useCallback((id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0)
    );
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cart.reduce((sum, i) => sum + i.priceNum * i.quantity, 0);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth" });
    setCartOpen(false);
  };

  return (
    <div
      dir="ltr"
      lang="en"
      className={theme === "light" ? "preview-page preview-light min-h-screen bg-background text-foreground" : "preview-page preview-dark min-h-screen bg-slate-950 text-white"}
    >
      <SEOHead title="Websites Preview" path="/preview/websites" />
      <PreviewPageControls />
      {typeof window !== "undefined" && window.self !== window.top && (
        <div className={`fixed top-0 inset-x-0 z-[60] h-9 backdrop-blur-sm border-b flex items-center justify-end px-4 ${
          isLight ? "bg-white/80 border-slate-200" : "bg-black/60 border-white/5"
        }`}>
          <button
            type="button"
            onClick={() => window.parent?.postMessage?.({ type: "webstudio-close-demo" }, "*")}
            className={`text-xs transition-colors ${isLight ? "text-slate-600 hover:text-cyan-700" : "text-slate-400 hover:text-cyan-400"}`}
          >
            {t("demo.backToExamples")}
          </button>
        </div>
      )}

      {/* Cart drawer */}
      <>
        <div
          className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${cartOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          onClick={() => setCartOpen(false)}
          aria-hidden
        />
        <div
          className={`fixed top-0 end-0 z-50 w-full max-w-md h-full bg-slate-900 border-s border-white/10 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
            cartOpen ? "translate-x-0" : "translate-x-full rtl:-translate-x-full"
          }`}
        >
          <div className={`p-6 border-b flex items-center justify-between ${isLight ? "border-slate-200 bg-white" : "border-white/10"}`}>
            <h2 className={`text-xl font-bold flex items-center gap-2 ${isLight ? "text-slate-900" : "text-white"}`}>
              <ShoppingCart className="w-5 h-5 text-cyan-400" />
              {t("demo.ecommerce.cart")}
              {cartCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/30 text-cyan-300 text-sm font-semibold">
                  {cartCount}
                </span>
              )}
            </h2>
            <button
              type="button"
              onClick={() => setCartOpen(false)}
              className={`p-2 rounded-lg transition-colors ${isLight ? "text-slate-500 hover:text-slate-900 hover:bg-slate-100" : "text-slate-400 hover:text-white hover:bg-white/10"}`}
              aria-label={t("demo.closeCart")}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className={`flex-1 overflow-y-auto p-6 ${isLight ? "bg-white" : ""}`}>
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${isLight ? "bg-slate-100" : "bg-white/5"}`}>
                  <ShoppingCart className="w-8 h-8 text-slate-500" />
                </div>
                <p className="text-slate-500 font-medium">{t("demo.ecommerce.cartEmpty")}</p>
                <p className={`text-sm mt-1 ${isLight ? "text-slate-600" : "text-slate-600"}`}>Add products from the store to get started.</p>
                <button
                  type="button"
                  onClick={() => { setCartOpen(false); scrollTo("products"); }}
                    className={`mt-6 px-6 py-3 rounded-xl font-semibold border transition-colors ${
                      isLight ? "bg-cyan-500/15 text-cyan-700 hover:bg-cyan-500/25 border-cyan-500/30" : "bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border-cyan-500/30"
                    }`}
                >
                  Browse products
                </button>
              </div>
            ) : (
              <ul className="space-y-4">
                {cart.map((item) => (
                  <li
                    key={item.id}
                    className={`flex gap-4 p-4 rounded-2xl border ${isLight ? "bg-slate-50 border-slate-200" : "bg-white/5 border-white/10"}`}
                  >
                    <img
                      src={item.img}
                      alt=""
                      loading="lazy"
                      className="w-20 h-20 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold truncate ${isLight ? "text-slate-900" : "text-white"}`}>{t(`demo.ecommerce.${item.keyName}`)}</p>
                      <p className="text-cyan-400 font-bold mt-0.5">{item.price}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                            isLight ? "bg-slate-100 hover:bg-slate-200 text-slate-800" : "bg-white/10 hover:bg-white/20 text-white"
                          }`}
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className={`w-8 text-center text-sm font-medium ${isLight ? "text-slate-900" : "text-white"}`}>{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                            isLight ? "bg-slate-100 hover:bg-slate-200 text-slate-800" : "bg-white/10 hover:bg-white/20 text-white"
                          }`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="ms-2 text-slate-500 hover:text-red-400 text-xs font-medium transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {cart.length > 0 && (
            <div className={`p-6 border-t ${isLight ? "border-slate-200 bg-white" : "border-white/10 bg-slate-900/95"}`}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-400 font-medium">{t("demo.ecommerce.total")}</span>
                <span className="text-2xl font-bold text-cyan-400">${cartTotal}</span>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => { setShowCheckoutMessage(true); setTimeout(() => setShowCheckoutMessage(false), 4000); }}
                  className={`w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 border transition-colors ${
                    isLight ? "bg-slate-900 text-[#f8fafc] border-slate-700 hover:bg-slate-800" : "bg-[#000] text-white border-white/20 hover:bg-slate-800"
                  }`}
                >
                  {t("demo.ecommerce.applePay")}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowCheckoutMessage(true); setTimeout(() => setShowCheckoutMessage(false), 4000); }}
                  className="w-full py-3.5 rounded-xl bg-white text-slate-800 font-semibold text-sm flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-100 transition-colors"
                >
                  {t("demo.ecommerce.googlePay")}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowCheckoutMessage(true); setTimeout(() => setShowCheckoutMessage(false), 4000); }}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-bold text-lg shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-[1.02] transition-all duration-200"
                >
                  {t("demo.ecommerce.checkout")}
                </button>
              </div>
            </div>
          )}
        </div>
      </>

      {/* Checkout demo message */}
      {showCheckoutMessage && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] px-6 py-4 rounded-2xl border shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 ${
          isLight ? "bg-white border-cyan-500/30 shadow-cyan-500/15" : "bg-slate-800 border-cyan-500/30 shadow-cyan-500/20"
        }`}>
          <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
            <Check className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <p className={`font-semibold ${isLight ? "text-slate-900" : "text-white"}`}>Demo store</p>
            <p className="text-slate-400 text-sm">This is a preview. Want a real store like this? We build it for you.</p>
          </div>
        </div>
      )}

      <header className={`sticky top-0 z-30 pt-12 pb-5 px-4 sm:px-6 border-b backdrop-blur-xl ${
        isLight ? "bg-white/85 border-slate-200" : "bg-slate-950/90 border-white/10"
      }`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button type="button" onClick={() => scrollTo("hero")} className={`font-bold text-2xl tracking-tight transition-colors text-start ${
            isLight ? "text-slate-900 hover:text-cyan-700" : "text-white hover:text-cyan-400"
          }`}>
            {t("demo.websites.brand")}
          </button>
          <nav className={`hidden sm:flex gap-6 text-sm font-medium ${isLight ? "text-slate-600" : "text-slate-400"}`}>
            <button type="button" onClick={() => scrollTo("hero")} className={`transition-colors ${isLight ? "hover:text-slate-900" : "hover:text-white"}`}>Home</button>
            <button type="button" onClick={() => scrollTo("products")} className={`transition-colors ${isLight ? "hover:text-slate-900" : "hover:text-white"}`}>Products</button>
            <button type="button" onClick={() => scrollTo("about")} className={`transition-colors ${isLight ? "hover:text-slate-900" : "hover:text-white"}`}>About</button>
            <button type="button" onClick={() => scrollTo("testimonials")} className={`transition-colors ${isLight ? "hover:text-slate-900" : "hover:text-white"}`}>Testimonials</button>
            <button type="button" onClick={() => scrollTo("blog")} className={`transition-colors ${isLight ? "hover:text-slate-900" : "hover:text-white"}`}>Blog</button>
            <button type="button" onClick={() => scrollTo("contact")} className={`transition-colors ${isLight ? "hover:text-slate-900" : "hover:text-white"}`}>Contact</button>
          </nav>
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
              isLight
                ? "bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700"
                : "bg-white/10 hover:bg-white/15 border-white/10 text-slate-200"
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            {t("demo.ecommerce.cart")}
            {cartCount > 0 && (
              <span className="absolute -top-1 -end-1 min-w-[18px] h-[18px] rounded-full bg-cyan-500 text-white text-xs font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Demo banner */}
      <div className={`text-center py-3 px-4 text-sm font-medium border-b ${
        isLight ? "bg-cyan-50 text-cyan-800 border-cyan-100" : "bg-cyan-500/10 text-cyan-300 border-cyan-500/20"
      }`}>
        {t("demo.websites.demoBanner")}
      </div>

      {/* Hero */}
      <section id="hero" className="relative py-20 sm:py-28 px-4 overflow-hidden">
        <div className={`absolute inset-0 ${isLight ? "bg-gradient-to-br from-cyan-500/5 via-violet-500/5 to-rose-500/5" : "bg-gradient-to-br from-cyan-500/10 via-violet-500/10 to-rose-500/10"}`} />
        <div className={`absolute inset-0 ${isLight ? "bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(6,182,212,0.1),transparent)]" : "bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(6,182,212,0.2),transparent)]"}`} />
        <div className="absolute top-10 end-10 w-64 h-64 bg-violet-500/15 rounded-full blur-3xl" />
        <div className="absolute bottom-10 start-10 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl" />
        <div className="relative max-w-6xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              {t("demo.websites.heroTitle")}
            </span>
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            {t("demo.websites.heroSubtitle")}
          </p>
          <button
            type="button"
            onClick={() => scrollTo("products")}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] transition-all duration-200"
          >
            View products
          </button>
        </div>
      </section>

      {/* Corporate / Business Section */}
      <section className={`py-20 px-4 border-t ${isLight ? "border-slate-200 bg-white/70" : "border-white/10 bg-white/[0.02]"}`}>
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-3xl sm:text-4xl font-bold text-center mb-4 ${isLight ? "text-slate-900" : "text-white"}`}>
            {t("demo.websites.corporateTitle")}
          </h2>
          <p className={`text-center mb-14 max-w-xl mx-auto ${isLight ? "text-slate-600" : "text-slate-500"}`}>
            {t("demo.websites.corporateSubtitle")}
          </p>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { Icon: Building2, titleKey: "demo.websites.corp1.title", descKey: "demo.websites.corp1.desc", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&h=300&fit=crop", gradient: "from-violet-500/20 to-violet-600/5", border: "border-violet-500/20" },
              { Icon: Briefcase, titleKey: "demo.websites.corp2.title", descKey: "demo.websites.corp2.desc", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop", gradient: "from-cyan-500/20 to-cyan-600/5", border: "border-cyan-500/20" },
              { Icon: MessageSquare, titleKey: "demo.websites.corp3.title", descKey: "demo.websites.corp3.desc", img: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=500&h=300&fit=crop", gradient: "from-emerald-500/20 to-emerald-600/5", border: "border-emerald-500/20" },
            ].map(({ Icon, titleKey, descKey, img, gradient, border }) => (
              <div key={titleKey} className={`group rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-xl ${border} ${isLight ? "bg-white" : "bg-slate-900/80"}`}>
                <div className="aspect-video overflow-hidden">
                  <img src={img} alt="" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className={`p-6 bg-gradient-to-br ${gradient}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isLight ? "bg-white/80" : "bg-white/10"}`}>
                      <Icon className={`w-5 h-5 ${isLight ? "text-slate-700" : "text-white"}`} />
                    </div>
                    <h3 className={`font-bold text-lg ${isLight ? "text-slate-900" : "text-white"}`}>{t(titleKey)}</h3>
                  </div>
                  <p className={`text-sm leading-relaxed ${isLight ? "text-slate-600" : "text-slate-400"}`}>{t(descKey)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* E-commerce Products */}
      <section id="products" className={`py-20 px-4 border-t ${isLight ? "border-slate-200" : "border-white/10"}`}>
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-3xl sm:text-4xl font-bold text-center mb-4 ${isLight ? "text-slate-900" : "text-white"}`}>
            {t("demo.websites.ecommerceTitle")}
          </h2>
          <p className={`text-center mb-14 max-w-xl mx-auto ${isLight ? "text-slate-600" : "text-slate-500"}`}>
            {t("demo.websites.ecommerceSubtitle")}
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {PRODUCTS.map((p, idx) => {
              const accents = [
                { border: "hover:border-cyan-500/30", shadow: "hover:shadow-cyan-500/10", price: "text-cyan-400", badge: "bg-cyan-500/90", btn: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/30" },
                { border: "hover:border-emerald-500/30", shadow: "hover:shadow-emerald-500/10", price: "text-emerald-400", badge: "bg-emerald-500/90", btn: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30" },
                { border: "hover:border-violet-500/30", shadow: "hover:shadow-violet-500/10", price: "text-violet-400", badge: "bg-violet-500/90", btn: "bg-violet-500/20 text-violet-300 border-violet-500/30 hover:bg-violet-500/30" },
                { border: "hover:border-amber-500/30", shadow: "hover:shadow-amber-500/10", price: "text-amber-400", badge: "bg-amber-500/90", btn: "bg-amber-500/20 text-amber-300 border-amber-500/30 hover:bg-amber-500/30" },
                { border: "hover:border-rose-500/30", shadow: "hover:shadow-rose-500/10", price: "text-rose-400", badge: "bg-rose-500/90", btn: "bg-rose-500/20 text-rose-300 border-rose-500/30 hover:bg-rose-500/30" },
                { border: "hover:border-cyan-500/30", shadow: "hover:shadow-cyan-500/10", price: "text-cyan-400", badge: "bg-cyan-500/90", btn: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/30" },
              ];
              const acc = accents[idx % accents.length];
              return (
              <div
                key={p.id}
                className={`group rounded-3xl overflow-hidden border transition-all duration-300 hover:shadow-xl ${acc.border} ${acc.shadow} ${
                  isLight ? "border-slate-300 bg-white" : "border-white/10 bg-slate-900/80"
                }`}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  {p.badge && (
                    <span className={`absolute top-4 start-4 z-10 px-3 py-1 rounded-full ${acc.badge} text-white text-xs font-semibold`}>
                      {p.badge}
                    </span>
                  )}
                  <img
                    src={p.img}
                    alt=""
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity ${
                    isLight ? "bg-gradient-to-t from-white/45 to-transparent" : "bg-gradient-to-t from-slate-900/60 to-transparent"
                  }`} />
                </div>
                <div className="p-6">
                  <h3 className={`font-bold text-lg mb-1 ${isLight ? "text-slate-900" : "text-white"}`}>{t(`demo.ecommerce.${p.keyName}`)}</h3>
                  <p className={`text-sm mb-4 ${isLight ? "text-slate-600" : "text-slate-400"}`}>{t(`demo.ecommerce.${p.keyDesc}`)}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-xl font-bold ${isLight ? "text-slate-900" : acc.price}`}>{p.price}</span>
                    <button
                      type="button"
                      onClick={() => addToCart(p)}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-300 ${
                        addedId === p.id
                          ? (isLight ? "bg-emerald-500/18 text-emerald-700 border-emerald-500/35" : "bg-emerald-500/30 text-emerald-300 border-emerald-500/50")
                          : (isLight ? "bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200" : acc.btn)
                      }`}
                    >
                      {addedId === p.id ? <Check className="w-4 h-4" /> : null}
                      {addedId === p.id ? "Added" : t("demo.ecommerce.addToCart")}
                    </button>
                  </div>
                </div>
              </div>
            );})}
          </div>
        </div>
      </section>

      {/* About / Why us */}
      <section id="about" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-3xl sm:text-4xl font-bold text-center mb-4 ${isLight ? "text-slate-900" : "text-white"}`}>
            {t("demo.websites.whatWeBuild")}
          </h2>
          <p className={`text-center max-w-2xl mx-auto mb-14 ${isLight ? "text-slate-600" : "text-slate-500"}`}>
            {t("demo.websites.body")}
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { Icon: Layout, titleKey: "demo.websites.bullet1", gradient: "from-cyan-500/20 to-cyan-600/5", border: "border-cyan-500/20" },
              { Icon: Zap, titleKey: "demo.websites.bullet2", gradient: "from-emerald-500/20 to-emerald-600/5", border: "border-emerald-500/20" },
              { Icon: Globe, titleKey: "demo.websites.bullet3", gradient: "from-amber-500/20 to-amber-600/5", border: "border-amber-500/20" },
            ].map(({ Icon, titleKey, gradient, border }) => (
              <div
                key={titleKey}
                className={`rounded-2xl bg-gradient-to-br ${gradient} border ${border} p-6 flex items-start gap-4 hover:scale-[1.02] transition-transform`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isLight ? "bg-white/70" : "bg-white/10"}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className={`${isLight ? "text-slate-900" : "text-white"} font-semibold leading-snug`}>{t(titleKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className={`py-20 px-4 border-t ${isLight ? "border-slate-200 bg-white/60" : "border-white/10 bg-white/[0.02]"}`}>
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-3xl sm:text-4xl font-bold text-center mb-4 ${isLight ? "text-slate-900" : "text-white"}`}>What our customers say</h2>
          <p className={`text-center mb-14 max-w-xl mx-auto ${isLight ? "text-slate-600" : "text-slate-500"}`}>Real stories from real people.</p>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { quote: "Best purchase I've made this year. Fast shipping and the product exceeded expectations.", name: "Jordan M.", role: "Designer" },
              { quote: "Quality is outstanding. Customer support was super helpful when I had questions.", name: "Sam L.", role: "Developer" },
              { quote: "Simple, elegant, and exactly what I needed. Will order again.", name: "Alex K.", role: "Founder" },
            ].map((item, i) => (
              <div key={i} className={`rounded-2xl border p-6 ${isLight ? "bg-white border-slate-300" : "bg-slate-900/80 border-white/10"}`}>
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className={`text-sm leading-relaxed mb-4 ${isLight ? "text-slate-700" : "text-slate-300"}`}>&ldquo;{item.quote}&rdquo;</p>
                <p className={`${isLight ? "text-slate-900" : "text-white"} font-semibold`}>{item.name}</p>
                <p className={`text-xs ${isLight ? "text-slate-600" : "text-slate-500"}`}>{item.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tips & Insights */}
      <section id="blog" className={`py-20 px-4 border-t ${isLight ? "border-slate-200" : "border-white/10"}`}>
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-3xl sm:text-4xl font-bold text-center mb-4 ${isLight ? "text-slate-900" : "text-white"}`}>Tips & Insights</h2>
          <p className={`text-center mb-14 max-w-xl mx-auto ${isLight ? "text-slate-600" : "text-slate-500"}`}>Practical advice to help your business grow online.</p>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                img: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=500&h=300&fit=crop",
                tag: "Growth",
                tagColor: isLight ? "bg-cyan-100 text-cyan-800" : "bg-cyan-500/20 text-cyan-300",
                title: "5 Ways to Double Your Website Conversions",
                content: "Most websites lose visitors because the call-to-action isn't clear. Here's what works: place your main CTA above the fold, use contrasting colors, add social proof near buttons, simplify your forms to 3 fields max, and A/B test your headlines. Small changes, big results.",
              },
              {
                img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop",
                tag: "Branding",
                tagColor: isLight ? "bg-violet-100 text-violet-800" : "bg-violet-500/20 text-violet-300",
                title: "Why Your Brand Needs a Professional Website in 2026",
                content: "Social media alone isn't enough. A professional website builds trust, ranks on Google, and gives you full control over your brand story. It's your 24/7 salesperson — it works while you sleep. Clients check your website before they call you.",
              },
              {
                img: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=500&h=300&fit=crop",
                tag: "E-commerce",
                tagColor: isLight ? "bg-emerald-100 text-emerald-800" : "bg-emerald-500/20 text-emerald-300",
                title: "Starting an Online Store? Here's What You Need",
                content: "A successful e-commerce store needs: high-quality product photos, clear descriptions, fast checkout (3 clicks max), mobile-first design, Apple Pay & Google Pay integration, and trust signals like reviews and secure payment badges.",
              },
            ].map((post, i) => (
              <article key={i} className={`group rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-xl ${isLight ? "border-slate-300 bg-white hover:border-cyan-400/50" : "border-white/10 bg-slate-900/80 hover:border-cyan-500/30"}`}>
                <div className="aspect-video overflow-hidden relative">
                  <img src={post.img} alt="" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className={`absolute top-3 start-3 px-3 py-1 rounded-full text-xs font-semibold ${post.tagColor}`}>{post.tag}</span>
                </div>
                <div className="p-5 sm:p-6">
                  <h3 className={`font-bold text-lg mb-3 transition-colors ${isLight ? "text-slate-900 group-hover:text-cyan-700" : "text-white group-hover:text-cyan-400"}`}>{post.title}</h3>
                  <p className={`text-sm leading-relaxed ${isLight ? "text-slate-600" : "text-slate-400"}`}>{post.content}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className={`py-20 px-4 border-t ${isLight ? "border-slate-200 bg-white/60" : "border-white/10 bg-white/[0.02]"}`}>
        <div className="max-w-2xl mx-auto">
          <h2 className={`text-3xl sm:text-4xl font-bold text-center mb-4 ${isLight ? "text-slate-900" : "text-white"}`}>Get in touch</h2>
          <p className={`text-center mb-10 ${isLight ? "text-slate-600" : "text-slate-500"}`}>Have a question? We’d love to hear from you.</p>
          <div className={`rounded-3xl border p-6 sm:p-8 ${isLight ? "border-slate-300 bg-white" : "border-white/10 bg-slate-900/80"}`}>
            {contactSuccess ? (
              <div className="text-center py-8">
                <p className="text-emerald-400 font-semibold mb-2">{t("demo.previewSuccess")}</p>
                <p className="text-slate-500 text-sm">Your details stay in this demo only.</p>
                <button type="button" onClick={() => setContactSuccess(false)} className="mt-4 text-cyan-400 text-sm font-medium hover:underline">
                  Send another message
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => { e.preventDefault(); setContactSuccess(true); }}
                className="space-y-4"
              >
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isLight ? "text-slate-700" : "text-slate-400"}`}>Name</label>
                  <input type="text" placeholder="Your name" value={contactName} onChange={(e) => setContactName(e.target.value)} className={`w-full px-4 py-3 rounded-xl border focus:border-cyan-500/50 focus:outline-none ${isLight ? "bg-white border-slate-300 text-slate-900 placeholder-slate-400" : "bg-white/5 border-white/10 text-white placeholder-slate-500"}`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isLight ? "text-slate-700" : "text-slate-400"}`}>Email</label>
                  <input type="email" placeholder="you@example.com" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className={`w-full px-4 py-3 rounded-xl border focus:border-cyan-500/50 focus:outline-none ${isLight ? "bg-white border-slate-300 text-slate-900 placeholder-slate-400" : "bg-white/5 border-white/10 text-white placeholder-slate-500"}`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isLight ? "text-slate-700" : "text-slate-400"}`}>Message</label>
                  <textarea rows={4} placeholder="Your message..." value={contactMessage} onChange={(e) => setContactMessage(e.target.value)} className={`w-full px-4 py-3 rounded-xl border focus:border-cyan-500/50 focus:outline-none resize-none ${isLight ? "bg-white border-slate-300 text-slate-900 placeholder-slate-400" : "bg-white/5 border-white/10 text-white placeholder-slate-500"}`} />
                </div>
                <button type="submit" className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" />
                  Send message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className={`py-12 px-4 border-y ${isLight ? "border-slate-200 bg-white/60" : "border-white/10 bg-white/[0.02]"}`}>
        <div className={`max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-sm ${isLight ? "text-slate-600" : "text-slate-500"}`}>
          <span className="flex items-center gap-2">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> 4.9/5 from 2,000+ reviews
          </span>
          <span>Free shipping over $50</span>
          <span>Secure checkout</span>
          <span>30-day returns</span>
        </div>
      </section>

      <footer className={`py-12 px-4 border-t ${isLight ? "border-slate-200" : "border-white/10"}`}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className={`text-sm font-medium ${isLight ? "text-slate-600" : "text-slate-500"}`}>© Demo — {t("demo.websites.brand")}</span>
          <div className={`flex gap-8 text-sm ${isLight ? "text-slate-600" : "text-slate-400"}`}>
            <a href="#" className={`transition-colors ${isLight ? "hover:text-slate-900" : "hover:text-white"}`}>Privacy</a>
            <a href="#" className={`transition-colors ${isLight ? "hover:text-slate-900" : "hover:text-white"}`}>Terms</a>
            <a href="#" className={`transition-colors ${isLight ? "hover:text-slate-900" : "hover:text-white"}`}>Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
