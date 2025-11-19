import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Package, Users, DoorClosed } from "lucide-react";

export default function FulfillmentsPage() {
  const { pathname } = useLocation();
  const active = pathname.startsWith("/fulfillments/staff")
    ? "staff"
    : pathname.startsWith("/fulfillments/rooms")
    ? "rooms"
    : "items";

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-6 sm:gap-8 animate-slide-in-bottom">
      {/* Enhanced Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20">
          <CheckCircle className="size-4 text-success" />
          <span className="text-sm font-medium text-success">Requirement Fulfillments</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight gradient-text">
          Fulfillments
        </h1>
      </div>

      {/* Modern Tabs */}
      <Tabs value={active} className="w-full">
        <TabsList className="h-12 p-1 bg-muted/50 border-2">
          <TabsTrigger value="items" asChild className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-md">
            <Link to="/fulfillments/items">
              <Package className="size-4" />
              Items
            </Link>
          </TabsTrigger>
          <TabsTrigger value="staff" asChild className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-md">
            <Link to="/fulfillments/staff">
              <Users className="size-4" />
              Staff
            </Link>
          </TabsTrigger>
          <TabsTrigger value="rooms" asChild className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-md">
            <Link to="/fulfillments/rooms">
              <DoorClosed className="size-4" />
              Rooms
            </Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <Outlet />
    </div>
  );
}
