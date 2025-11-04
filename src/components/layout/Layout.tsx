import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./Sidebar";
import { Header } from "./Header";
import { Outlet } from "react-router-dom";

export function Layout() {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <Header />
          <main className="flex-1 overflow-auto p-6 bg-[radial-gradient(1250px_450px_at_50%_-50%,hsl(var(--primary)/0.08),transparent)]">
            <div className="mx-auto w-full max-w-[1200px]">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
