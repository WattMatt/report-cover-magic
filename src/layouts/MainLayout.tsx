import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { UserMenu } from "@/components/UserMenu";
import { Zap, FileText } from "lucide-react";

const MainLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-cover-gradient text-cover-text-light py-4 px-6 shadow-lg flex items-center gap-4">
            <SidebarTrigger className="text-white hover:bg-white/10" />
            <div className="flex items-center gap-3 flex-1">
              <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-wide">Report Page Generator</h1>
                <p className="text-xs text-white/70">Professional Document Templates</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-white/70">
                <FileText className="h-4 w-4" />
                <span>Word Export</span>
              </div>
              <UserMenu />
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>

          {/* Footer */}
          <footer className="bg-secondary/50 border-t border-border py-4 px-6">
            <div className="text-center text-sm text-muted-foreground">
              <p>© {new Date().getFullYear()} WM Engineering. Professional Document Solutions.</p>
            </div>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
