import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Home,
  Building2,
  Users,
  FileText,
  Euro,
  Wrench,
  Receipt,
  BarChart3,
  Settings,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Tableau de Bord",
    url: createPageUrl("Dashboard"),
    icon: Home,
  },
  {
    title: "Mes Biens",
    url: createPageUrl("Biens"),
    icon: Building2,
  },
  {
    title: "Locataires",
    url: createPageUrl("Locataires"),
    icon: Users,
  },
  {
    title: "Contrats de Bail",
    url: createPageUrl("Contrats"),
    icon: FileText,
  },
  {
    title: "Loyers",
    url: createPageUrl("Loyers"),
    icon: Euro,
  },
  {
    title: "Travaux",
    url: createPageUrl("Travaux"),
    icon: Wrench,
  },
  {
    title: "Factures",
    url: createPageUrl("Factures"),
    icon: Receipt,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <style>{`
        :root {
          --primary-navy: #1e3a5f;
          --primary-blue: #2563eb;
          --accent-gold: #f59e0b;
          --neutral-warm: #f8fafc;
          --text-primary: #0f172a;
          --text-secondary: #64748b;
          --border-elegant: #e2e8f0;
        }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
          background: linear-gradient(135deg, var(--neutral-warm) 0%, #ffffff 100%);
        }
        
        .luxury-gradient {
          background: linear-gradient(135deg, var(--primary-navy) 0%, var(--primary-blue) 100%);
        }
        
        .gold-accent {
          background: linear-gradient(135deg, var(--accent-gold) 0%, #fbbf24 100%);
        }
        
        .glass-morphism {
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.18);
        }
      `}</style>

      <div className="min-h-screen flex w-full">
        <Sidebar className="border-r border-slate-200 bg-white/80 backdrop-blur-sm">
          <SidebarHeader className="border-b border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 luxury-gradient rounded-xl flex items-center justify-center shadow-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-lg">
                  PropManager
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Gestion Locative Premium
                </p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 py-3">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={`group hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 rounded-xl py-3 px-4 ${
                          location.pathname === item.url
                            ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-sm border border-blue-200"
                            : "text-slate-600"
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3">
                          <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-8">
              <SidebarGroupLabel className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 py-3">
                Aperçu Rapide
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-4 py-3 space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Biens Actifs</span>
                    <span className="font-bold text-slate-900">0</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Revenus Mensuels</span>
                    <span className="font-bold text-green-600">0 €</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">En Retard</span>
                    <span className="font-bold text-red-500">0</span>
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 gold-accent rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 text-sm truncate">
                  Propriétaire
                </p>
                <p className="text-xs text-slate-500 truncate">
                  Gestion de patrimoine
                </p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col bg-gradient-to-br from-slate-50 to-white">
          <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 px-8 py-6 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-slate-100 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-bold text-slate-900">PropManager</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
