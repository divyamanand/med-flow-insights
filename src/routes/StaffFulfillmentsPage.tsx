import React from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StaffFulfillments } from "@/components/fulfillments/StaffFulfillments";

export default function StaffFulfillmentsPage() {
  const { id } = useParams();
  if (!id) return null;
  return (
    <div className="p-4 sm:p-6 flex flex-col gap-4">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Staff Requirement Fulfillments</CardTitle>
          <Button asChild variant="outline"><Link to="/requirements/staff">Back</Link></Button>
        </CardHeader>
        <CardContent>
          <StaffFulfillments requirementId={id} />
        </CardContent>
      </Card>
    </div>
  );
}
