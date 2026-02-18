import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, CreditCard, Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useSearch } from "wouter";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PageWrapper } from "@/components/page-wrapper";
import { useI18n } from "@/lib/i18n";

const planData: Record<string, { nameKey: string; priceKey: string; descKey: string; features: string[] }> = {
  starter: {
    nameKey: "pricing.starter",
    priceKey: "pricing.starter.price",
    descKey: "pricing.starter.desc",
    features: ["pricing.feature.1a", "pricing.feature.1b", "pricing.feature.1c", "pricing.feature.1d", "pricing.feature.1e"],
  },
  pro: {
    nameKey: "pricing.pro",
    priceKey: "pricing.pro.price",
    descKey: "pricing.pro.desc",
    features: ["pricing.feature.2a", "pricing.feature.2b", "pricing.feature.2c", "pricing.feature.2d", "pricing.feature.2e", "pricing.feature.2f", "pricing.feature.2g"],
  },
  enterprise: {
    nameKey: "pricing.enterprise",
    priceKey: "pricing.enterprise.price",
    descKey: "pricing.enterprise.desc",
    features: ["pricing.feature.3a", "pricing.feature.3b", "pricing.feature.3c", "pricing.feature.3d", "pricing.feature.3e", "pricing.feature.3f", "pricing.feature.3g", "pricing.feature.3h"],
  },
};

const planIds = ["starter", "pro", "enterprise"] as const;

export default function Checkout() {
  const { t } = useI18n();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const initialPlan = params.get("plan") || "pro";
  const [selectedPlanId, setSelectedPlanId] = useState(initialPlan in planData ? initialPlan : "pro");
  const plan = planData[selectedPlanId];

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
      plan: selectedPlanId,
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

              <div className="mb-6" data-testid="card-order-summary">
                <h3 className="text-sm text-slate-500 uppercase tracking-wider mb-3">{t("checkout.choosePlan")}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {planIds.map((pid) => {
                    const p = planData[pid];
                    const isSelected = pid === selectedPlanId;
                    return (
                      <button
                        key={pid}
                        type="button"
                        onClick={() => setSelectedPlanId(pid)}
                        className={`relative glass-card rounded-md p-4 text-start transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? "ring-2 ring-neon-purple/60 bg-neon-purple/[0.06]"
                            : "ring-1 ring-white/[0.06] hover:ring-white/[0.12]"
                        }`}
                        data-testid={`button-select-plan-${pid}`}
                      >
                        {pid === "pro" && (
                          <span className="absolute -top-2 end-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-gradient-to-r from-neon-purple to-neon-cyan text-white">
                            <Star className="w-2.5 h-2.5" />
                            {t("pricing.popular")}
                          </span>
                        )}
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                            isSelected ? "border-neon-purple bg-neon-purple" : "border-slate-600"
                          }`}>
                            {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                          </div>
                          <span className="font-semibold text-white text-sm">{t(p.nameKey)}</span>
                        </div>
                        <div className="text-xl font-bold gradient-text mb-1">{t(p.priceKey)}</div>
                        <div className="text-xs text-slate-500">{t("pricing.perProject")}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="glass-card rounded-md p-5 mb-6" data-testid="card-plan-features">
                <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
                  <div>
                    <div className="text-lg font-semibold text-white">{t(plan.nameKey)}</div>
                    <div className="text-sm text-slate-400">{t(plan.descKey)}</div>
                  </div>
                  <div className="text-end">
                    <div className="text-2xl font-bold gradient-text">{t(plan.priceKey)}</div>
                    <div className="text-xs text-slate-500">{t("pricing.perProject")}</div>
                  </div>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {plan.features.map((fKey) => (
                    <li key={fKey} className="flex items-start gap-2 text-sm text-slate-300">
                      <Check className="w-3.5 h-3.5 mt-0.5 shrink-0 text-neon-cyan" />
                      {t(fKey)}
                    </li>
                  ))}
                </ul>
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
