
import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./Sidebar";
import { Header } from "./Header";
import { Outlet } from "react-router-dom";
import { getFirestore, getDocs, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function Layout() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check Firebase connection by making a simple query
    const checkConnection = async () => {
      try {
        await getDocs(collection(db, "doctors"));
        setIsLoading(false);
      } catch (error) {
        console.error("Firebase connection error:", error);
        // Still set loading to false after a timeout, even if there was an error
        setTimeout(() => setIsLoading(false), 2000);
      }
    };
    
    checkConnection();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="text-lg font-medium">Connecting to Firebase...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <Header />
          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
