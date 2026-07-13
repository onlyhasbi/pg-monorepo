import { Button } from "@repo/ui/ui/button";
import { KeyRound, Lock, LogOut, Settings, LayoutDashboard, Menu, X } from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";
import React, { useState } from "react";

interface AdminLayoutProps {
  onOpenSecret: () => void;
  onLogout: () => void;
  children: React.ReactNode;
}

/**
 * Sidebar navigation layout for the Super Admin dashboard.
 * Adapts to a hamburger menu drawer on mobile.
 */
export function AdminLayout({ onOpenSecret, onLogout, children }: AdminLayoutProps) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const currentPath = location.pathname;

  const navItems = [
    {
      name: "Daftar Halaman",
      href: "/",
      icon: LayoutDashboard,
      active: currentPath === "/",
    },
    {
      name: "Pengaturan Sistem",
      href: "/settings",
      icon: Settings,
      active: currentPath === "/settings",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-800 font-sans">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-slate-900 text-white h-16 px-4 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
            <Lock className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-sm block">Super Admin</span>
            <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block">Public Gold Portal</span>
          </div>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white focus:outline-none"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar - Desktop & Mobile Drawer */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white flex flex-col justify-between transform transition-transform duration-300 ease-in-out border-r border-slate-800/50
          md:translate-x-0 md:static md:h-screen md:sticky md:top-0
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex flex-col flex-1 py-6 px-4">
          {/* Logo Section */}
          <div className="hidden md:flex items-center gap-3 mb-8 px-2">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/20 ring-2 ring-white/10">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-base block tracking-tight">Super Admin</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mt-0.5">
                Public Gold Portal
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200
                    ${item.active 
                      ? "bg-red-600 text-white shadow-lg shadow-red-600/10" 
                      : "text-slate-400 hover:text-white hover:bg-slate-800/60"}
                  `}
                >
                  <Icon className="w-4.5 h-4.5" />
                  {item.name}
                </Link>
              );
            })}

            {/* Portal Secret Trigger Button */}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenSecret();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all duration-200 text-left cursor-pointer"
            >
              <KeyRound className="w-4.5 h-4.5" />
              Portal Secret
            </button>
          </nav>
        </div>

        {/* Footer / Logout */}
        <div className="p-4 border-t border-slate-800/60 bg-slate-950/40">
          <Button
            variant="ghost"
            onClick={onLogout}
            className="w-full justify-start text-red-400 hover:text-white hover:bg-red-600/90 border-transparent hover:border-transparent transition-all font-bold py-2.5 rounded-xl gap-3 px-3 cursor-pointer"
          >
            <LogOut className="w-4.5 h-4.5" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Backdrop for mobile drawer */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
