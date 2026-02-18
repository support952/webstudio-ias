import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Zap, ChevronDown, Globe, LogIn, UserPlus, LogOut, User, LayoutDashboard, PlusCircle, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { useI18n, languageNames, type Language } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";

const guestLinks = [
  { labelKey: "nav.home", href: "/" },
  { labelKey: "nav.services", href: "/services" },
  { labelKey: "nav.about", href: "/about" },
  { labelKey: "nav.pricing", href: "/pricing" },
  { labelKey: "nav.contact", href: "/contact" },
];

const userLinks = [
  { labelKey: "nav.dashboard", href: "/dashboard", icon: LayoutDashboard },
  { labelKey: "nav.newRequest", href: "/dashboard/requests", icon: PlusCircle },
  { labelKey: "nav.profile", href: "/dashboard/profile", icon: User },
  { labelKey: "nav.settings", href: "/dashboard/settings", icon: Settings },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { t, lang, setLang } = useI18n();
  const { user, logout } = useAuth();
  const [location] = useLocation();

  const navLinks = user ? userLinks : guestLinks;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = () => {
      setLangOpen(false);
      setUserMenuOpen(false);
    };
    if (langOpen || userMenuOpen) {
      document.addEventListener("click", handleClick);
      return () => document.removeEventListener("click", handleClick);
    }
  }, [langOpen, userMenuOpen]);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-nav" : "bg-transparent"
      }`}
      data-testid="header-navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16 sm:h-20">
          <Link href="/" className="flex items-center gap-2 shrink-0" data-testid="link-logo">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              WebStudio
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1" data-testid="nav-desktop">
            {navLinks.map((link) => {
              const isActive = location === link.href || (link.href !== "/" && location.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 text-sm transition-colors duration-200 rounded-md flex items-center gap-1.5 ${
                    isActive
                      ? "text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                  data-testid={`link-nav-${link.labelKey.split(".")[1]}`}
                >
                  {"icon" in link && link.icon && <link.icon className="w-4 h-4" />}
                  {t(link.labelKey)}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 gap-1.5"
                onClick={(e) => {
                  e.stopPropagation();
                  setLangOpen(!langOpen);
                }}
                data-testid="button-language-switcher"
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline text-xs uppercase">{lang}</span>
                <ChevronDown className="w-3 h-3" />
              </Button>

              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute end-0 top-full mt-1 w-36 glass-card rounded-md py-1 z-50"
                    data-testid="dropdown-language"
                  >
                    {(Object.entries(languageNames) as [Language, string][]).map(
                      ([code, name]) => (
                        <button
                          key={code}
                          onClick={() => {
                            setLang(code);
                            setLangOpen(false);
                          }}
                          className={`w-full text-start px-3 py-2 text-sm transition-colors ${
                            lang === code
                              ? "text-white bg-white/[0.06]"
                              : "text-slate-400 hover:text-white hover:bg-white/[0.03]"
                          }`}
                          data-testid={`button-lang-${code}`}
                        >
                          {name}
                        </button>
                      )
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {user ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-300 gap-1.5"
                  onClick={(e) => {
                    e.stopPropagation();
                    setUserMenuOpen(!userMenuOpen);
                  }}
                  data-testid="button-user-menu"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="hidden sm:inline text-sm max-w-[100px] truncate">
                    {user.fullName.split(" ")[0]}
                  </span>
                  <ChevronDown className="w-3 h-3" />
                </Button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="absolute end-0 top-full mt-1 w-48 glass-card rounded-md py-1 z-50"
                      data-testid="dropdown-user-menu"
                    >
                      <div className="px-3 py-2 border-b border-white/[0.06]">
                        <p className="text-sm text-white font-medium truncate">{user.fullName}</p>
                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-start px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/[0.03] flex items-center gap-2"
                        data-testid="button-logout"
                      >
                        <LogOut className="w-4 h-4" />
                        {t("nav.logout")}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/register">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-300 gap-1.5"
                    data-testid="button-register"
                  >
                    <UserPlus className="w-4 h-4" />
                    {t("nav.register")}
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    className="bg-gradient-to-r from-neon-purple to-neon-cyan text-white border-0 no-default-hover-elevate no-default-active-elevate"
                    size="sm"
                    data-testid="button-login"
                  >
                    <LogIn className="w-4 h-4" />
                    {t("nav.login")}
                  </Button>
                </Link>
              </div>
            )}

            <Button
              size="icon"
              variant="ghost"
              className="lg:hidden text-slate-300"
              onClick={() => setMobileOpen(!mobileOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass-nav"
            data-testid="nav-mobile"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => {
                const isActive = location === link.href || (link.href !== "/" && location.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-3 py-2.5 text-sm transition-colors rounded-md flex items-center gap-2 ${
                      isActive
                        ? "text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                    data-testid={`link-mobile-${link.labelKey.split(".")[1]}`}
                  >
                    {"icon" in link && link.icon && <link.icon className="w-4 h-4" />}
                    {t(link.labelKey)}
                  </Link>
                );
              })}

              {user ? (
                <div className="pt-2 border-t border-white/[0.06]">
                  <div className="px-3 py-2">
                    <p className="text-sm text-white font-medium">{user.fullName}</p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className="w-full text-start px-3 py-2.5 text-sm text-slate-400 hover:text-white flex items-center gap-2"
                    data-testid="button-mobile-logout"
                  >
                    <LogOut className="w-4 h-4" />
                    {t("nav.logout")}
                  </button>
                </div>
              ) : (
                <div className="pt-2 space-y-2 border-t border-white/[0.06]">
                  <Link href="/register" onClick={() => setMobileOpen(false)}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2 text-slate-300"
                      data-testid="button-mobile-register"
                    >
                      <UserPlus className="w-4 h-4" />
                      {t("nav.register")}
                    </Button>
                  </Link>
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    <Button
                      className="w-full bg-gradient-to-r from-neon-purple to-neon-cyan text-white border-0 no-default-hover-elevate no-default-active-elevate"
                      data-testid="button-mobile-login"
                    >
                      <LogIn className="w-4 h-4" />
                      {t("nav.login")}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
