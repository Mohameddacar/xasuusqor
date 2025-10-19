
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { BookOpen, Plus, Home, Settings, TrendingUp, Target } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "My Entries",
    url: createPageUrl("Entries"),
    icon: Home,
  },
  {
    title: "Journals",
    url: createPageUrl("Journals"),
    icon: BookOpen,
  },
  {
    title: "New Entry",
    url: createPageUrl("NewEntry"),
    icon: Plus,
  },
  {
    title: "Insights",
    url: createPageUrl("Insights"),
    icon: TrendingUp,
  },
  {
    title: "Goals",
    url: createPageUrl("Goals"),
    icon: Target,
  },
  {
    title: "Settings",
    url: createPageUrl("Settings"),
    icon: Settings,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <style>{`
        :root {
          --background: #FBF9F6;
          --foreground: #3C3835;
          --card: #FFFFFF;
          --card-foreground: #3C3835;
          --primary: #8B7355;
          --primary-foreground: #FFFFFF;
          --secondary: #E8DDD0;
          --muted: #F5F0E8;
          --accent: #C4A57B;
          --border: #E8DDD0;
        }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
      `}</style>
      
      <div className="min-h-screen flex w-full bg-[#FBF9F6]">
        <Sidebar className="border-r border-[#E8DDD0] bg-white">
          <SidebarHeader className="border-b border-[#E8DDD0] p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#8B7355] to-[#C4A57B] rounded-2xl flex items-center justify-center shadow-sm">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-[#3C3835] text-lg">Private Diary</h2>
                <p className="text-xs text-[#8B7355]">Your personal journal</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`hover:bg-[#F5F0E8] transition-colors duration-200 rounded-xl ${
                          location.pathname === item.url ? 'bg-[#F5F0E8] text-[#8B7355]' : 'text-[#3C3835]'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                          <item.icon className="w-4 h-4" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white/80 backdrop-blur-sm border-b border-[#E8DDD0] px-6 py-4 md:hidden sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-[#F5F0E8] p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-lg font-semibold text-[#3C3835]">Private Diary</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
