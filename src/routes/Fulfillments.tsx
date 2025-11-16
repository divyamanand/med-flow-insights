import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function FulfillmentsPage() {
  const { pathname } = useLocation();
  const active = pathname.startsWith("/fulfillments/staff")
    ? "staff"
    : pathname.startsWith("/fulfillments/rooms")
    ? "rooms"
    : "items";

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Fulfillments</h1>
      <Tabs value={active} className="w-full">
        <TabsList>
          <TabsTrigger value="items" asChild>
            <Link to="/fulfillments/items">Items</Link>
          </TabsTrigger>
          <TabsTrigger value="staff" asChild>
            <Link to="/fulfillments/staff">Staff</Link>
          </TabsTrigger>
          <TabsTrigger value="rooms" asChild>
            <Link to="/fulfillments/rooms">Rooms</Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <Outlet />
    </div>
  );
}
