import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Globe, LogOut, User, LayoutDashboard, PlusCircle, Settings, Sun, Moon, type LucideIcon } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { useI18n, languageNames, type Language } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";

const guestLinks: { labelKey: string; href: string }[] = [
  { labelKey: "nav.home", href: "/" },
  { labelKey: "nav.services", href: "/services" },
  { labelKey: "nav.products", href: "/products" },
  { labelKey: "nav.pricing", href: "/pricing" },
  { labelKey: "nav.contact", href: "/contact" },
];

const userLinks: { labelKey: string; href: string; icon: LucideIcon }[] = [
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
  const { theme, toggleTheme } = useTheme();
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
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[999] focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-cyan font-medium"
      >
        Skip to Content
      </a>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16 sm:h-20">
          <Logo href="/" variant={theme === "light" ? "light" : "dark"} className="shrink-0" />

          <nav className="hidden lg:flex items-center gap-0.5" data-testid="nav-desktop">
            {navLinks.map((link) => {
              const isActive = location === link.href || (link.href !== "/" && location.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2.5 text-sm font-medium tracking-wide transition-colors duration-200 rounded-lg flex items-center gap-1.5 ${
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  data-testid={`link-nav-${link.labelKey.split(".")[1]}`}
                >
                  {"icon" in link && (() => {
                    const Icon = link.icon as LucideIcon;
                    return <Icon className="w-4 h-4" />;
                  })()}
                  {t(link.labelKey)}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              data-testid="button-theme-toggle"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground gap-1.5"
                onClick={(e) => {
                  e.stopPropagation();
                  setLangOpen(!langOpen);
                }}
                aria-label="Select language"
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
                              ? "text-foreground bg-accent"
                              : "text-muted-foreground hover:text-foreground hover:bg-accent"
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
                  className="text-muted-foreground gap-1.5"
                  onClick={(e) => {
                    e.stopPropagation();
                    setUserMenuOpen(!userMenuOpen);
                  }}
                  data-testid="button-user-menu"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-primary-foreground" />
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
                        <p className="text-sm text-foreground font-medium truncate">{user.fullName}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-start px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent flex items-center gap-2"
                        data-testid="button-logout"
                      >
                        <LogOut className="w-4 h-4" />
                        {t("nav.logout")}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : null}

            <Button
              size="icon"
              variant="ghost"
              className="lg:hidden text-muted-foreground min-h-[48px] min-w-[48px] rounded-lg transition-transform duration-200 hover:scale-105 active:scale-95"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              data-testid="button-mobile-menu"
            >
              <motion.span
                initial={false}
                animate={{ rotate: mobileOpen ? 90 : 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.span>
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
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden glass-nav"
            data-testid="nav-mobile"
          >
            <div className="px-4 py-3 space-y-0.5">
              {navLinks.map((link) => {
                const isActive = location === link.href || (link.href !== "/" && location.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex min-h-[48px] items-center px-3 py-3 text-sm transition-colors rounded-lg gap-2 ${
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    data-testid={`link-mobile-${link.labelKey.split(".")[1]}`}
                  >
                    {"icon" in link && (() => {
                      const Icon = link.icon as LucideIcon;
                      return <Icon className="w-4 h-4" />;
                    })()}
                    {t(link.labelKey)}
                  </Link>
                );
              })}

              {user ? (
                <div className="pt-2 border-t border-white/[0.06]">
                  <div className="px-3 py-2">
                    <p className="text-sm text-foreground font-medium">{user.fullName}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className="w-full min-h-[48px] text-start px-3 py-3 text-sm text-muted-foreground hover:text-foreground flex items-center gap-2 rounded-lg"
                    data-testid="button-mobile-logout"
                  >
                    <LogOut className="w-4 h-4" />
                    {t("nav.logout")}
                  </button>
                </div>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
