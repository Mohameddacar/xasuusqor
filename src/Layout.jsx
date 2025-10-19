
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
  useSidebar,
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

function LayoutContent({ children }) {
  const location = useLocation();
  const { setOpen } = useSidebar();

  const handleLinkClick = () => {
    // Close sidebar on mobile when link is clicked
    if (window.innerWidth < 768) {
      setOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-[#FBF9F6]">
      <Sidebar className="border-r border-[#E8DDD0] bg-white flex">
        <SidebarHeader className="border-b border-[#E8DDD0] p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#8B7355] to-[#C4A57B] rounded-2xl flex items-center justify-center shadow-sm">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-[#3C3835] text-base">Private Diary</h2>
              <p className="text-xs text-[#8B7355]">Your personal journal</p>
            </div>
          </div>
        </SidebarHeader>
        
        <SidebarContent className="p-3">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {navigationItems.map((item) => {
                  const isActive = location.pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`hover:bg-[#F5F0E8] transition-colors duration-200 rounded-lg ${
                          isActive ? 'bg-[#F5F0E8] text-[#3C3835]' : 'text-[#3C3835]'
                        }`}
                      >
                        <Link to={item.url} onClick={handleLinkClick} className="flex items-center gap-3 px-3 py-2.5">
                          <item.icon className="w-5 h-5" />
                          <span className="font-normal text-[15px]">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <main className="flex-1 flex flex-col md:ml-0">
        <header className="bg-white border-b border-[#E8DDD0] px-4 py-3 md:hidden sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="hover:bg-[#F5F0E8] p-2 rounded-lg transition-colors duration-200 text-[#3C3835]" />
            <h1 className="text-base font-semibold text-[#3C3835]">Private Diary</h1>
          </div>
        </header>

        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function Layout({ children, currentPageName }) {
  return (
    <SidebarProvider defaultOpen={false}>
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
      
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  );
}
