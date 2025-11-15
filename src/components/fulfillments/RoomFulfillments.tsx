import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { isoToLocalInput, toISO } from "./utils";

type RoomFulfillment = {
  id: string;
  roomRequirementId?: string;
  roomId: string;
  startAt?: string | null;
  endAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export function RoomFulfillments({ requirementId }: { requirementId: string }) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const q = useQuery({
    queryKey: ["rooms", requirementId, "fulfillments"],
    queryFn: async (): Promise<RoomFulfillment[]> => {
      const res = await api.get(`/requirements/rooms/${requirementId}/fulfillments`);
      return res.data;
    },
    enabled: Boolean(requirementId),
  });

  const createMut = useMutation({
    mutationFn: (body: { roomId: string; startAt?: string; endAt?: string }) =>
      api.post(`/requirements/rooms/${requirementId}/fulfillments`, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["rooms", requirementId, "fulfillments"] }),
  });

  const updateMut = useMutation({
    mutationFn: (payload: { fid: string; body: { startAt?: string | null; endAt?: string | null } }) =>
      api.patch(`/requirements/rooms/fulfillments/${payload.fid}`, payload.body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["rooms", requirementId, "fulfillments"] }),
  });

  const rows = q.data ?? [];
  const start = (page - 1) * pageSize;
  const end = Math.min(start + pageSize, rows.length);
  const paged = rows.slice(start, end);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Room Fulfillments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm">Requirement: {requirementId}</div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>+ Assign Room</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign Room</DialogTitle>
              </DialogHeader>
              <CreateRoomFulfillmentForm
                onSubmit={(v) =>
                  createMut.mutate({
                    roomId: v.roomId,
                    startAt: toISO(v.startAt) ?? undefined,
                    endAt: toISO(v.endAt) ?? undefined,
                  })
                }
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
                <TableHead>Room</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.id}</TableCell>
                  <TableCell>{r.roomId}</TableCell>
                  <TableCell>{r.startAt ?? "—"}</TableCell>
                  <TableCell>{r.endAt ?? "—"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">Edit</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Fulfillment</DialogTitle>
                          </DialogHeader>
                          <EditRoomFulfillmentForm
                            initial={r}
                            onSubmit={(payload) =>
                              updateMut.mutate({
                                fid: r.id,
                                body: {
                                  startAt: payload.startAt === "" ? null : toISO(payload.startAt) ?? null,
                                  endAt: payload.endAt === "" ? null : toISO(payload.endAt) ?? null,
                                },
                              })
                            }
                          />
                          <DialogFooter>
                            <Button disabled={updateMut.isPending}>Save</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5}>No fulfillments yet.</TableCell>
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

function CreateRoomFulfillmentForm({ onSubmit }: { onSubmit: (v: { roomId: string; startAt?: string; endAt?: string }) => void }) {
  const [roomId, setRoomId] = useState("");
  const [startAt, setStartAt] = useState<string | undefined>("");
  const [endAt, setEndAt] = useState<string | undefined>("");
  return (
    <div className="flex flex-col gap-3 py-2">
      <Input placeholder="Room ID" value={roomId} onChange={(e) => setRoomId(e.target.value)} />
      <label className="text-sm">Start</label>
      <Input type="datetime-local" value={startAt} onChange={(e) => setStartAt(e.target.value)} />
      <label className="text-sm">End</label>
      <Input type="datetime-local" value={endAt} onChange={(e) => setEndAt(e.target.value)} />
      <div className="flex justify-end">
        <Button onClick={() => onSubmit({ roomId, startAt, endAt })}>Create</Button>
      </div>
    </div>
  );
}

function EditRoomFulfillmentForm({ initial, onSubmit }: { initial: RoomFulfillment; onSubmit: (v: { startAt?: string | null; endAt?: string | null }) => void; }) {
  const [startAt, setStartAt] = useState<string>(isoToLocalInput(initial.startAt));
  const [endAt, setEndAt] = useState<string>(isoToLocalInput(initial.endAt));
  return (
    <div className="flex flex-col gap-3 py-2">
      <label className="text-sm">Start</label>
      <Input type="datetime-local" value={startAt} onChange={(e) => setStartAt(e.target.value)} />
      <label className="text-sm">End</label>
      <Input type="datetime-local" value={endAt} onChange={(e) => setEndAt(e.target.value)} />
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => { setStartAt(""); setEndAt(""); onSubmit({ startAt: null, endAt: null }); }}>Clear Dates</Button>
        <Button onClick={() => onSubmit({ startAt: startAt === "" ? null : startAt, endAt: endAt === "" ? null : endAt })}>Save</Button>
      </div>
    </div>
  );
}
