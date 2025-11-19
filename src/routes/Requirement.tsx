import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardList, DoorClosed, Users, Package } from "lucide-react";

export default function RequirementPage() {
  const { pathname } = useLocation();
  const active = pathname.startsWith("/requirements/staff")
    ? "staff"
    : pathname.startsWith("/requirements/items")
    ? "items"
    : "rooms";

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-6 sm:gap-8 animate-slide-in-bottom">
      {/* Enhanced Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-warning/10 border border-warning/20">
          <ClipboardList className="size-4 text-warning" />
          <span className="text-sm font-medium text-warning">Resource Management</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight gradient-text">
          Requirements
        </h1>
      </div>

      {/* Modern Tabs */}
      <Tabs value={active} className="w-full">
        <TabsList className="h-12 p-1 bg-muted/50 border-2">
          <TabsTrigger value="rooms" asChild className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-md">
            <Link to="/requirements/rooms">
              <DoorClosed className="size-4" />
              Rooms
            </Link>
          </TabsTrigger>
          <TabsTrigger value="staff" asChild className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-md">
            <Link to="/requirements/staff">
              <Users className="size-4" />
              Staff
            </Link>
          </TabsTrigger>
          <TabsTrigger value="items" asChild className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-md">
            <Link to="/requirements/items">
              <Package className="size-4" />
              Items
            </Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Outlet />
    </div>
  );
}
