import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function RequirementPage() {
  const { pathname } = useLocation();
  const active = pathname.startsWith("/requirements/staff")
    ? "staff"
    : pathname.startsWith("/requirements/items")
    ? "items"
    : "rooms";

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Requirements</h1>
      <Tabs value={active} className="w-full">
        <TabsList>
          <TabsTrigger value="rooms" asChild>
            <Link to="/requirements/rooms">Rooms</Link>
          </TabsTrigger>
          <TabsTrigger value="staff" asChild>
            <Link to="/requirements/staff">Staff</Link>
          </TabsTrigger>
          <TabsTrigger value="items" asChild>
            <Link to="/requirements/items">Items</Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Outlet />
    </div>
  );
}
