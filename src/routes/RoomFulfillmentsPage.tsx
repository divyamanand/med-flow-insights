import React from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RoomFulfillments } from "@/components/fulfillments/RoomFulfillments";

export default function RoomFulfillmentsPage() {
  const { id } = useParams();
  if (!id) return null;
  return (
    <div className="p-4 sm:p-6 flex flex-col gap-4">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Room Requirement Fulfillments</CardTitle>
          <Button asChild variant="outline"><Link to="/requirements/rooms">Back</Link></Button>
        </CardHeader>
        <CardContent>
          <RoomFulfillments requirementId={id} />
        </CardContent>
      </Card>
    </div>
  );
}
