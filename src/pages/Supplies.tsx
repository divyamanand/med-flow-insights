
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Search, Filter, MoreHorizontal, Plus, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample data
const supplies = [
  {
    item_id: 1001,
    name: "Disposable Gloves",
    type: "PPE",
    delivery_date: new Date(2023, 2, 15),
    expiry_date: new Date(2025, 2, 15),
    expired: false,
  },
  {
    item_id: 1002,
    name: "Surgical Masks",
    type: "PPE",
    delivery_date: new Date(2023, 1, 20),
    expiry_date: new Date(2025, 1, 20),
    expired: false,
  },
  {
    item_id: 1003,
    name: "Antibiotics - Amoxicillin",
    type: "Medication",
    delivery_date: new Date(2023, 0, 10),
    expiry_date: new Date(2023, 6, 10),
    expired: true,
  },
  {
    item_id: 1004,
    name: "IV Solution - Normal Saline",
    type: "Medical Supply",
    delivery_date: new Date(2023, 3, 5),
    expiry_date: new Date(2025, 3, 5),
    expired: false,
  },
  {
    item_id: 1005,
    name: "Syringes 10ml",
    type: "Medical Supply",
    delivery_date: new Date(2023, 2, 25),
    expiry_date: new Date(2026, 2, 25),
    expired: false,
  },
  {
    item_id: 1006,
    name: "Bandages",
    type: "Medical Supply",
    delivery_date: new Date(2023, 4, 1),
    expiry_date: new Date(2026, 4, 1),
    expired: false,
  },
  {
    item_id: 1007,
    name: "Antiseptic Solution",
    type: "Medical Supply",
    delivery_date: new Date(2023, 1, 15),
    expiry_date: new Date(2024, 1, 15),
    expired: false,
  },
  {
    item_id: 1008,
    name: "Painkillers - Ibuprofen",
    type: "Medication",
    delivery_date: new Date(2023, 0, 20),
    expiry_date: new Date(2023, 7, 20),
    expired: true,
  },
];

const bloodInventory = [
  {
    item_id: 5001,
    blood_group: "A+",
    type: "Whole Blood",
    delivery_date: new Date(2023, 3, 20),
    expiry_date: new Date(2023, 4, 18),
    expired: false,
  },
  {
    item_id: 5002,
    blood_group: "B+",
    type: "Platelets",
    delivery_date: new Date(2023, 3, 22),
    expiry_date: new Date(2023, 3, 29),
    expired: true,
  },
  {
    item_id: 5003,
    blood_group: "O-",
    type: "Whole Blood",
    delivery_date: new Date(2023, 3, 25),
    expiry_date: new Date(2023, 4, 23),
    expired: false,
  },
  {
    item_id: 5004,
    blood_group: "AB+",
    type: "Plasma",
    delivery_date: new Date(2023, 3, 26),
    expiry_date: new Date(2023, 6, 26),
    expired: false,
  },
  {
    item_id: 5005,
    blood_group: "A-",
    type: "Red Blood Cells",
    delivery_date: new Date(2023, 3, 27),
    expiry_date: new Date(2023, 5, 27),
    expired: false,
  },
  {
    item_id: 5006,
    blood_group: "O+",
    type: "Whole Blood",
    delivery_date: new Date(2023, 3, 15),
    expiry_date: new Date(2023, 4, 13),
    expired: false,
  },
];

export default function Supplies() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterExpired, setFilterExpired] = useState<boolean | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);
  
  const filteredSupplies = supplies.filter((item) => {
    const matchesSearch =
      searchTerm === "" ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesExpiredFilter = filterExpired === null || item.expired === filterExpired;
    const matchesTypeFilter = filterType === null || item.type === filterType;

    return matchesSearch && matchesExpiredFilter && matchesTypeFilter;
  });

  const [bloodSearchTerm, setBloodSearchTerm] = useState("");
  const [bloodFilterExpired, setBloodFilterExpired] = useState<boolean | null>(null);
  const [bloodFilterType, setBloodFilterType] = useState<string | null>(null);
  
  const filteredBlood = bloodInventory.filter((item) => {
    const matchesSearch =
      bloodSearchTerm === "" ||
      item.blood_group.toLowerCase().includes(bloodSearchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(bloodSearchTerm.toLowerCase());

    const matchesExpiredFilter = bloodFilterExpired === null || item.expired === bloodFilterExpired;
    const matchesTypeFilter = bloodFilterType === null || item.type === bloodFilterType;

    return matchesSearch && matchesExpiredFilter && matchesTypeFilter;
  });

  const expiringSupplies = supplies.filter(item => {
    if (item.expired) return false;
    
    const today = new Date();
    const timeDiff = item.expiry_date.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    return daysDiff <= 30;
  }).length;

  const expiringBlood = bloodInventory.filter(item => {
    if (item.expired) return false;
    
    const today = new Date();
    const timeDiff = item.expiry_date.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    return daysDiff <= 7;
  }).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inventory</h1>
          <p className="text-muted-foreground">Manage hospital supplies and blood inventory</p>
        </div>
      </div>

      {(expiringSupplies > 0 || expiringBlood > 0) && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 text-amber-700">
              <AlertCircle className="h-5 w-5" />
              <div>
                <p className="font-medium">Expiring Inventory Alert</p>
                <p className="text-sm">
                  {expiringSupplies > 0 && (
                    <span>{expiringSupplies} medical supplies expiring within 30 days. </span>
                  )}
                  {expiringBlood > 0 && (
                    <span>{expiringBlood} blood products expiring within 7 days.</span>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="supplies">
        <TabsList className="mb-4 grid w-full grid-cols-2">
          <TabsTrigger value="supplies">Medical Supplies</TabsTrigger>
          <TabsTrigger value="blood">Blood Inventory</TabsTrigger>
        </TabsList>
        
        <TabsContent value="supplies">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Medical Supplies</CardTitle>
                <CardDescription>Manage hospital supplies inventory</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px]">
                  <DialogHeader>
                    <DialogTitle>Add New Supply Item</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Item Name
                      </Label>
                      <Input id="name" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="type" className="text-right">
                        Type
                      </Label>
                      <Input id="type" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="delivery" className="text-right">
                        Delivery Date
                      </Label>
                      <Input id="delivery" type="date" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="expiry" className="text-right">
                        Expiry Date
                      </Label>
                      <Input id="expiry" type="date" className="col-span-3" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Save</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search supplies..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Filter className="mr-2 h-4 w-4" />
                      {filterType || "Filter Type"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setFilterType(null)}>
                      All Types
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterType("PPE")}>
                      PPE
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterType("Medication")}>
                      Medication
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterType("Medical Supply")}>
                      Medical Supply
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Filter className="mr-2 h-4 w-4" />
                      {filterExpired === null 
                        ? "Expiry Status" 
                        : filterExpired 
                        ? "Expired" 
                        : "Valid"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by Expiry</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setFilterExpired(null)}>
                      All
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterExpired(true)}>
                      Expired
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterExpired(false)}>
                      Valid
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Delivery Date</TableHead>
                      <TableHead>Expiry Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSupplies.map((item) => (
                      <TableRow key={`${item.item_id}-${item.delivery_date.toISOString()}`}>
                        <TableCell>{item.item_id}</TableCell>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.type}</TableCell>
                        <TableCell>{format(item.delivery_date, "PP")}</TableCell>
                        <TableCell>{format(item.expiry_date, "PP")}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              item.expired
                                ? "border-red-200 bg-red-50 text-red-500"
                                : "border-green-200 bg-green-50 text-green-500"
                            }
                          >
                            {item.expired ? "Expired" : "Valid"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 p-0"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Update Item</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="blood">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Blood Inventory</CardTitle>
                <CardDescription>Manage blood bank inventory</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Blood Unit
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px]">
                  <DialogHeader>
                    <DialogTitle>Add New Blood Unit</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="blood-group" className="text-right">
                        Blood Group
                      </Label>
                      <Input id="blood-group" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="blood-type" className="text-right">
                        Type
                      </Label>
                      <Input id="blood-type" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="blood-delivery" className="text-right">
                        Delivery Date
                      </Label>
                      <Input id="blood-delivery" type="date" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="blood-expiry" className="text-right">
                        Expiry Date
                      </Label>
                      <Input id="blood-expiry" type="date" className="col-span-3" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Save</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search blood inventory..."
                    className="pl-9"
                    value={bloodSearchTerm}
                    onChange={(e) => setBloodSearchTerm(e.target.value)}
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Filter className="mr-2 h-4 w-4" />
                      {bloodFilterType || "Filter Type"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setBloodFilterType(null)}>
                      All Types
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setBloodFilterType("Whole Blood")}>
                      Whole Blood
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setBloodFilterType("Platelets")}>
                      Platelets
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setBloodFilterType("Plasma")}>
                      Plasma
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setBloodFilterType("Red Blood Cells")}>
                      Red Blood Cells
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Filter className="mr-2 h-4 w-4" />
                      {bloodFilterExpired === null 
                        ? "Expiry Status" 
                        : bloodFilterExpired 
                        ? "Expired" 
                        : "Valid"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by Expiry</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setBloodFilterExpired(null)}>
                      All
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setBloodFilterExpired(true)}>
                      Expired
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setBloodFilterExpired(false)}>
                      Valid
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item ID</TableHead>
                      <TableHead>Blood Group</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Delivery Date</TableHead>
                      <TableHead>Expiry Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBlood.map((item) => (
                      <TableRow key={`${item.item_id}-${item.delivery_date.toISOString()}-${item.blood_group}`}>
                        <TableCell>{item.item_id}</TableCell>
                        <TableCell className="font-medium">{item.blood_group}</TableCell>
                        <TableCell>{item.type}</TableCell>
                        <TableCell>{format(item.delivery_date, "PP")}</TableCell>
                        <TableCell>{format(item.expiry_date, "PP")}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              item.expired
                                ? "border-red-200 bg-red-50 text-red-500"
                                : "border-green-200 bg-green-50 text-green-500"
                            }
                          >
                            {item.expired ? "Expired" : "Valid"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 p-0"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Update Item</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
