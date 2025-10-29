import { useAuth } from "@/_core/hooks/useAuth";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import {
  Home,
  BookOpen,
  Calendar,
  MessageSquare,
  HelpCircle,
  LogOut,
  FileText,
  RotateCcw,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  badge?: number;
}

export default function DOMLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, logout } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    { icon: <Home size={20} />, label: "Dashboard", path: "/" },
    { icon: <Calendar size={20} />, label: "Plano", path: "/plano" },
    { icon: <BookOpen size={20} />, label: "Aulas", path: "/aulas" },
    { icon: <FileText size={20} />, label: "Materiais", path: "/materiais" },
    { icon: <HelpCircle size={20} />, label: "Questões", path: "/questoes" },
    { icon: <MessageSquare size={20} />, label: "Fórum", path: "/forum" },
    { icon: <RotateCcw size={20} />, label: "Revisão", path: "/revisao" },
  ];

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  const NavContent = () => (
    <>
      {/* Logo e Título */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          {APP_LOGO && (
            <img src={APP_LOGO} alt={APP_TITLE} className="h-10 w-10 object-contain" />
          )}
          <div>
            <h1 className="text-xl font-bold text-foreground">{APP_TITLE}</h1>
            {user && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {user.name || user.email}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Menu de Navegação */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location === item.path;
          return (
            <Link key={item.path} href={item.path}>
              <a
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto bg-destructive text-destructive-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </a>
            </Link>
          );
        })}
      </nav>

      {/* Rodapé com Logout */}
      <div className="p-4 border-t border-border">
        {isAuthenticated ? (
          <Button
            variant="outline"
            className="w-full justify-start gap-3"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            <span>Sair</span>
          </Button>
        ) : (
          <Button
            variant="default"
            className="w-full"
            onClick={() => (window.location.href = getLoginUrl())}
          >
            Entrar
          </Button>
        )}
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col bg-card border-r border-border">
        <NavContent />
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            {APP_LOGO && (
              <img src={APP_LOGO} alt={APP_TITLE} className="h-8 w-8 object-contain" />
            )}
            <h1 className="text-lg font-bold text-foreground">{APP_TITLE}</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border flex flex-col">
            <NavContent />
          </aside>
        </>
      )}

      {/* Main Content */}
      <main className="lg:pl-72 pt-16 lg:pt-0">
        <div className="min-h-screen">{children}</div>
      </main>
    </div>
  );
}
