import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useSearch } from "wouter";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PageWrapper } from "@/components/page-wrapper";
import { useI18n } from "@/lib/i18n";

const planData: Record<string, { nameKey: string; priceKey: string; descKey: string }> = {
  starter: { nameKey: "pricing.starter", priceKey: "pricing.starter.price", descKey: "pricing.starter.desc" },
  pro: { nameKey: "pricing.pro", priceKey: "pricing.pro.price", descKey: "pricing.pro.desc" },
  enterprise: { nameKey: "pricing.enterprise", priceKey: "pricing.enterprise.price", descKey: "pricing.enterprise.desc" },
};

export default function Checkout() {
  const { t } = useI18n();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const planId = params.get("plan") || "pro";
  const plan = planData[planId] || planData.pro;

  const [formData, setFormData] = useState({
    fullName: "",
    company: "",
    email: "",
    phone: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });
  const [processing, setProcessing] = useState(false);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    console.log("Order Details:", {
      plan: planId,
      planName: t(plan.nameKey),
      price: t(plan.priceKey),
      customer: {
        fullName: formData.fullName,
        company: formData.company,
        email: formData.email,
        phone: formData.phone,
      },
      payment: {
        cardNumber: formData.cardNumber ? `****${formData.cardNumber.slice(-4)}` : "",
        expiry: formData.expiry,
      },
    });
    setTimeout(() => setProcessing(false), 2000);
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />

        <section className="pt-32 pb-24 sm:pt-40 sm:pb-32">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link href="/pricing">
                <Button variant="ghost" size="sm" className="text-slate-400 mb-6" data-testid="button-back-pricing">
                  <ArrowLeft className="w-4 h-4 me-2" />
                  {t("checkout.back")}
                </Button>
              </Link>

              <h1 className="text-2xl sm:text-3xl font-bold mb-2" data-testid="text-checkout-title">
                {t("checkout.title")}
              </h1>
              <p className="text-slate-400 mb-8">{t("checkout.subtitle")}</p>

              <div className="glass-card rounded-md p-6 mb-6" data-testid="card-order-summary">
                <h3 className="text-sm text-slate-500 uppercase tracking-wider mb-3">{t("checkout.plan")}</h3>
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <div className="text-lg font-semibold text-white">{t(plan.nameKey)}</div>
                    <div className="text-sm text-slate-400">{t(plan.descKey)}</div>
                  </div>
                  <div className="text-end">
                    <div className="text-2xl font-bold gradient-text">{t(plan.priceKey)}</div>
                    <div className="text-xs text-slate-500">{t("pricing.perProject")}</div>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6" data-testid="form-checkout">
                <div className="glass-card rounded-md p-6">
                  <h3 className="text-sm text-slate-500 uppercase tracking-wider mb-4">{t("checkout.details")}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm text-slate-300">{t("checkout.fullName")}</Label>
                      <Input
                        value={formData.fullName}
                        onChange={handleChange("fullName")}
                        placeholder="John Doe"
                        required
                        className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-neon-purple/50"
                        data-testid="input-checkout-name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-slate-300">{t("checkout.company")}</Label>
                      <Input
                        value={formData.company}
                        onChange={handleChange("company")}
                        placeholder="Acme Inc."
                        className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-neon-purple/50"
                        data-testid="input-checkout-company"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-slate-300">{t("checkout.email")}</Label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={handleChange("email")}
                        placeholder="john@example.com"
                        required
                        className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-neon-purple/50"
                        data-testid="input-checkout-email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-slate-300">{t("checkout.phone")}</Label>
                      <Input
                        value={formData.phone}
                        onChange={handleChange("phone")}
                        placeholder="+1 (555) 000-0000"
                        className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-neon-purple/50"
                        data-testid="input-checkout-phone"
                      />
                    </div>
                  </div>
                </div>

                <div className="glass-card rounded-md p-6">
                  <h3 className="text-sm text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    {t("checkout.payment")}
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm text-slate-300">{t("checkout.cardNumber")}</Label>
                      <Input
                        value={formData.cardNumber}
                        onChange={handleChange("cardNumber")}
                        placeholder="4242 4242 4242 4242"
                        maxLength={19}
                        required
                        className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-neon-purple/50 font-mono"
                        data-testid="input-checkout-card"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm text-slate-300">{t("checkout.expiry")}</Label>
                        <Input
                          value={formData.expiry}
                          onChange={handleChange("expiry")}
                          placeholder="MM/YY"
                          maxLength={5}
                          required
                          className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-neon-purple/50 font-mono"
                          data-testid="input-checkout-expiry"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm text-slate-300">{t("checkout.cvc")}</Label>
                        <Input
                          value={formData.cvc}
                          onChange={handleChange("cvc")}
                          placeholder="123"
                          maxLength={4}
                          required
                          className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-neon-purple/50 font-mono"
                          data-testid="input-checkout-cvc"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass-card rounded-md p-6 flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <div className="text-sm text-slate-500">{t("checkout.total")}</div>
                    <div className="text-2xl font-bold text-white">{t(plan.priceKey)}</div>
                  </div>
                  <Button
                    type="submit"
                    disabled={processing}
                    size="lg"
                    className="bg-gradient-to-r from-neon-purple to-neon-cyan text-white border-0 no-default-hover-elevate no-default-active-elevate px-10"
                    data-testid="button-pay-now"
                  >
                    {processing ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {t("checkout.processing")}
                      </span>
                    ) : (
                      t("checkout.payNow")
                    )}
                  </Button>
                </div>

                <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
                  <Lock className="w-3 h-3" />
                  {t("checkout.secure")}
                </div>
              </form>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </PageWrapper>
  );
}
