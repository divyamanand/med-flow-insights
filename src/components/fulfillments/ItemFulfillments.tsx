import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

type ItemFulfillment = {
  id: string;
  itemRequirementId?: string;
  itemId: string;
  quantity: number;
  createdAt?: string;
  updatedAt?: string;
};

export function ItemFulfillments({ requirementId }: { requirementId: string }) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const q = useQuery({
    queryKey: ["items", requirementId, "fulfillments"],
    queryFn: async (): Promise<ItemFulfillment[]> => {
      const res = await api.get(`/requirements/items/${requirementId}/fulfillments`);
      return res.data;
    },
    enabled: Boolean(requirementId),
  });

  const createMut = useMutation({
    mutationFn: (body: { itemId: string; quantity: number }) =>
      api.post(`/requirements/items/${requirementId}/fulfillments`, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["items", requirementId, "fulfillments"] }),
  });

  const rows = q.data ?? [];
  const start = (page - 1) * pageSize;
  const end = Math.min(start + pageSize, rows.length);
  const paged = rows.slice(start, end);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Item Fulfillments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm">Requirement: {requirementId}</div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>+ Add Items</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Item Fulfillment</DialogTitle>
              </DialogHeader>
              <CreateItemFulfillmentForm
                onSubmit={(v) => createMut.mutate({ itemId: v.itemId, quantity: Number(v.quantity || 0) })}
              />
              <DialogFooter>
                <Button disabled={createMut.isPending}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.id}</TableCell>
                  <TableCell>{r.itemId}</TableCell>
                  <TableCell>{r.quantity}</TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3}>No fulfillments yet.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm">
          <div>Showing {rows.length === 0 ? 0 : start + 1}-{end} of {rows.length}</div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>{'<'}</Button>
            <Button size="sm" variant="outline" disabled={end >= rows.length} onClick={() => setPage((p) => p + 1)}>{'>'}</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CreateItemFulfillmentForm({ onSubmit }: { onSubmit: (v: { itemId: string; quantity: number }) => void }) {
  const [itemId, setItemId] = useState("");
  const [quantity, setQuantity] = useState<number | string>("");
  return (
    <div className="flex flex-col gap-3 py-2">
      <Input placeholder="Item ID" value={itemId} onChange={(e) => setItemId(e.target.value)} />
      <Input type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
      <div className="flex justify-end">
        <Button onClick={() => onSubmit({ itemId, quantity: Number(quantity || 0) })}>Create</Button>
      </div>
    </div>
  );
}
