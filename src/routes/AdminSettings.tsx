import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";

/* -------------------------------------------------------------------------- */
/*                               MOCKED API LAYER                             */
/*            (Replace with api.get/post/put later, already structured)       */
/* -------------------------------------------------------------------------- */

const mockFetchSettings = async () => {
  await new Promise((r) => setTimeout(r, 300));
  return {
    general: {
      hospitalName: "City General Hospital",
      timezone: "UTC+00:00",
      logo: "",
    },
    notifications: {
      minPasswordLength: 8,
      accessTokenExpiry: 8,
      refreshTokenExpiry: 30,
      appointmentExpiry: 14,
      reminderTimings: [24, 12, 1],
    },
    security: {
      minPasswordLength: 8,
      refreshTokenDays: 7,
    },
    retention: {
      auditRetention: 365,
      inviteRetention: 90,
      autoDeleteCancelledDays: 30,
    },
    toggles: {
      backupEnabled: true,
      maintenanceEnabled: false,
    },
  };
};

const mockSaveSettings = async (payload: any) => {
  console.log("🚀 Saving Settings:", payload);
  await new Promise((r) => setTimeout(r, 400));
  return { success: true };
};

/* -------------------------------------------------------------------------- */
/*                               MAIN COMPONENT                               */
/* -------------------------------------------------------------------------- */

export default function AdministratorSettings() {
  /* ------------------------------ LOAD SETTINGS ------------------------------ */

  const settingsQ = useQuery({
    queryKey: ["admin-settings"],
    queryFn: mockFetchSettings,
    staleTime: 60_000,
  });

  const saveMutation = useMutation({
    mutationFn: mockSaveSettings,
  });

  const settings = settingsQ.data;

  /* ----------------------------- LOCAL STATE FORM ---------------------------- */

  const [form, setForm] = useState<any>(null);

  // Load into form once fetched
  if (!form && settings) setForm(settings);

  if (settingsQ.isLoading || !form) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="size-6" />
      </div>
    );
  }

  /* ------------------------------ UPDATE HANDLER ----------------------------- */

  function update(path: string, value: any) {
    setForm((prev: any) => {
      const updated = structuredClone(prev);
      const keys = path.split(".");
      let obj = updated;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return updated;
    });
  }

  function handleSave() {
    saveMutation.mutate(form);
  }

  /* -------------------------------------------------------------------------- */
  /*                                   UI                                       */
  /* -------------------------------------------------------------------------- */

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-8">
      <h1 className="text-2xl font-semibold">Administrator Settings</h1>

      {/* ------------------------------- GENERAL ------------------------------- */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>General</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Hospital Name</Label>
              <Input
                value={form.general.hospitalName}
                onChange={(e) => update("general.hospitalName", e.target.value)}
              />
            </div>

            <div>
              <Label>Timezone</Label>
              <Select
                value={form.general.timezone}
                onValueChange={(v) => update("general.timezone", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC+00:00">UTC+00:00</SelectItem>
                  <SelectItem value="UTC+05:30">UTC+05:30 (IST)</SelectItem>
                  <SelectItem value="UTC-05:00">UTC-05:00 (EST)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Hospital Logo</Label>
              <Input type="file" />
            </div>
          </CardContent>
        </Card>

        {/* ----------------------------- SECURITY ------------------------------ */}
        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Minimum Password Length</Label>
              <Input
                type="number"
                value={form.security.minPasswordLength}
                onChange={(e) =>
                  update("security.minPasswordLength", Number(e.target.value))
                }
              />
            </div>

            <div>
              <Label>Refresh Token Validity (days)</Label>
              <Input
                type="number"
                value={form.security.refreshTokenDays}
                onChange={(e) =>
                  update("security.refreshTokenDays", Number(e.target.value))
                }
              />
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Email Provider Configuration</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Email Provider (Demo)</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">Configure SMTP later.</p>
                <DialogFooter>
                  <Button>Save (Demo)</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>

      {/* ----------------------------- NOTIFICATIONS ---------------------------- */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>

        <CardContent className="grid md:grid-cols-3 gap-6">
          {/* LEFT SIDE */}
          <div className="space-y-4">
            <div>
              <Label>Minimum Password Length</Label>
              <Input
                type="number"
                value={form.notifications.minPasswordLength}
                onChange={(e) =>
                  update("notifications.minPasswordLength", Number(e.target.value))
                }
              />
            </div>

            <div>
              <Label>Access Token Expiry (minutes)</Label>
              <Input
                type="number"
                value={form.notifications.accessTokenExpiry}
                onChange={(e) =>
                  update("notifications.accessTokenExpiry", Number(e.target.value))
                }
              />
            </div>

            <div>
              <Label>Refresh Token Expiry (minutes)</Label>
              <Input
                type="number"
                value={form.notifications.refreshTokenExpiry}
                onChange={(e) =>
                  update("notifications.refreshTokenExpiry", Number(e.target.value))
                }
              />
            </div>
          </div>

          {/* CENTER */}
          <div className="space-y-4">
            <Label>Appointment Expiry (days)</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={form.notifications.appointmentExpiry}
                onChange={(e) =>
                  update("notifications.appointmentExpiry", Number(e.target.value))
                }
              />
              <Button variant="outline">Configure</Button>
            </div>

            <Label>Reminder Timings</Label>

            <div className="space-y-1">
              {[24, 12, 1].map((h) => (
                <div key={h} className="flex items-center gap-2">
                  <Switch
                    checked={form.notifications.reminderTimings.includes(h)}
                    onCheckedChange={(checked) => {
                      const arr = [...form.notifications.reminderTimings];
                      if (checked) arr.push(h);
                      else arr.splice(arr.indexOf(h), 1);
                      update("notifications.reminderTimings", arr);
                    }}
                  />
                  <span>{h} hours</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-4">
            <div>
              <Label>Audit Log Retention (days)</Label>
              <Input
                type="number"
                value={form.retention.auditRetention}
                onChange={(e) =>
                  update("retention.auditRetention", Number(e.target.value))
                }
              />
            </div>

            <div>
              <Label>Patient Invite Retention (days)</Label>
              <Input
                type="number"
                value={form.retention.inviteRetention}
                onChange={(e) =>
                  update("retention.inviteRetention", Number(e.target.value))
                }
              />
            </div>

            <div>
              <Label>Auto-delete Cancelled Appointments After (days)</Label>
              <Input
                type="number"
                value={form.retention.autoDeleteCancelledDays}
                onChange={(e) =>
                  update("retention.autoDeleteCancelledDays", Number(e.target.value))
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ------------------------------- TOGGLES ------------------------------- */}
      <Card>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Trigger Database Backup</Label>
            <Switch
              checked={form.toggles.backupEnabled}
              onCheckedChange={(v) => update("toggles.backupEnabled", v)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Maintenance Mode</Label>
            <Switch
              checked={form.toggles.maintenanceEnabled}
              onCheckedChange={(v) => update("toggles.maintenanceEnabled", v)}
            />
          </div>
        </CardContent>
      </Card>

      {/* ------------------------------ SAVE BUTTON ----------------------------- */}
      <div className="flex justify-end">
        <Button
          className="px-6"
          disabled={saveMutation.isPending}
          onClick={handleSave}
        >
          {saveMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
