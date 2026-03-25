import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, ShoppingCart, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { BrowserFrame } from "@/components/browser-frame";
import { SEOHead } from "@/components/seo-head";

const products = [
  { id: "1", name: "Wireless Headphones", price: 129, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop" },
  { id: "2", name: "Smart Watch", price: 249, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop" },
  { id: "3", name: "Portable Speaker", price: 89, image: "https://images.unsplash.com/photo-1543512214-318c7553f230?w=400&h=400&fit=crop" },
  { id: "4", name: "USB-C Hub", price: 49, image: "https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?w=400&h=400&fit=crop" },
];

export default function DemoEcommerce() {
  const { t } = useI18n();
  const [cart, setCart] = useState<{ id: string; qty: number }[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const addToCart = (id: string) => {
    setCart((prev) => {
      const i = prev.findIndex((x) => x.id === id);
      if (i >= 0) return prev.map((x, j) => (j === i ? { ...x, qty: x.qty + 1 } : x));
      return [...prev, { id, qty: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((x) => x.id !== id));
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((x) => (x.id === id ? { ...x, qty: Math.max(0, x.qty + delta) } : x))
        .filter((x) => x.qty > 0)
    );
  };

  const cartItems = cart
    .map((c) => {
      const p = products.find((x) => x.id === c.id);
      return p ? { ...p, qty: c.qty } : null;
    })
    .filter(Boolean) as (typeof products[0] & { qty: number })[];

  const total = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <div className="min-h-screen bg-slate-800/90 text-white py-8 px-4">
      <SEOHead title="E-commerce Demo" path="/demos/ecommerce" />
      <div className="max-w-6xl mx-auto mb-6 flex items-center justify-between">
        <Link href="/">
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white gap-1.5">
            <ArrowLeft className="w-4 h-4" />
            {t("demo.backToExamples")}
          </Button>
        </Link>
      </div>
      <BrowserFrame url="https://shop-demo.webstudio.co.il">
        <div className="relative min-h-[500px] bg-slate-950 text-white">
          <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/90 backdrop-blur-md">
            <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
              <span className="font-bold text-xl">ShopDemo</span>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-white/20"
                  onClick={() => setCartOpen(!cartOpen)}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {t("demo.ecommerce.cart")} ({cartItems.reduce((s, i) => s + i.qty, 0)})
                </Button>
              </div>
            </div>
          </header>

          <main id="main-content" className="max-w-6xl mx-auto px-4 py-10">
            <h1 className="text-2xl font-bold mb-8">{t("demo.ecommerce.title")}</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="rounded-xl border border-white/10 bg-white/5 overflow-hidden hover:border-white/20 transition-colors"
                >
                  <div className="aspect-square relative">
                    <img src={p.image} alt="" loading="lazy" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-white mb-1">{p.name}</h3>
                    <p className="text-emerald-400 font-medium mb-3">${p.price}</p>
                    <Button
                      size="sm"
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => addToCart(p.id)}
                    >
                      {t("demo.ecommerce.addToCart")}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </main>

          {cartOpen && (
            <>
              <div className="absolute inset-0 bg-black/50 z-40" onClick={() => setCartOpen(false)} />
              <div className="absolute top-0 end-0 w-full max-w-sm h-full bg-slate-900 border-s border-white/10 z-50 shadow-xl flex flex-col">
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                  <h2 className="font-bold text-lg">{t("demo.ecommerce.cart")}</h2>
                  <Button variant="ghost" size="sm" onClick={() => setCartOpen(false)}>
                    ×
                  </Button>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  {cartItems.length === 0 ? (
                    <p className="text-slate-500 text-sm">{t("demo.ecommerce.cartEmpty")}</p>
                  ) : (
                    <ul className="space-y-4">
                      {cartItems.map((item) => (
                        <li key={item.id} className="flex gap-3 border-b border-white/5 pb-4">
                          <img src={item.image} alt="" loading="lazy" className="w-16 h-16 rounded-lg object-cover" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-white truncate">{item.name}</p>
                            <p className="text-emerald-400 text-sm">${item.price}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => updateQty(item.id, -1)}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="text-sm w-6 text-center">{item.qty}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => updateQty(item.id, 1)}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-slate-500 ml-auto"
                                onClick={() => removeFromCart(item.id)}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="p-4 border-t border-white/10">
                  <div className="flex justify-between text-lg font-semibold mb-4">
                    <span>{t("demo.ecommerce.total")}</span>
                    <span className="text-emerald-400">${total}</span>
                  </div>
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700" size="lg">
                    {t("demo.ecommerce.checkout")}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </BrowserFrame>
    </div>
  );
}
