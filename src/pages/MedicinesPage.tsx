import React from 'react'
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { differenceInDays } from "date-fns"


// Define the Medicine Batch type
interface MedicineBatch {
  id: string
  quantity: number
  expirationDate: Date
  batchNumber: string
  manufacturer: string
}

// Define the Medicine type with multiple batches
interface Medicine {
  id: string
  name: string
  batches: MedicineBatch[]
}

// Sample data
const medicinesData: Medicine[] = [
  {
    id: "1",
    name: "MED A",
    batches: [
      {
        id: "1-1",
        quantity: 3,
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now (valid)
        batchNumber: "BA-12345",
        manufacturer: "Pharma Inc.",
      },
      {
        id: "1-2",
        quantity: 5,
        expirationDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now (expiring soon)
        batchNumber: "BA-12346",
        manufacturer: "Pharma Inc.",
      },
      {
        id: "1-3",
        quantity: 4,
        expirationDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago (expired)
        batchNumber: "BA-12347",
        manufacturer: "Pharma Inc.",
      },
    ],
  },
  {
    id: "2",
    name: "MED B",
    batches: [
      {
        id: "2-1",
        quantity: 4,
        expirationDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now (valid)
        batchNumber: "BB-67890",
        manufacturer: "MediCorp",
      },
      {
        id: "2-2",
        quantity: 5,
        expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now (expiring soon)
        batchNumber: "BB-67891",
        manufacturer: "MediCorp",
      },
      {
        id: "2-3",
        quantity: 4,
        expirationDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago (expired)
        batchNumber: "BB-67892",
        manufacturer: "MediCorp",
      },
    ],
  },
  {
    id: "3",
    name: "MED C",
    batches: [
      {
        id: "3-1",
        quantity: 6,
        expirationDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now (valid)
        batchNumber: "BC-54321",
        manufacturer: "HealthPharm",
      },
      {
        id: "3-2",
        quantity: 3,
        expirationDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now (expiring soon)
        batchNumber: "BC-54322",
        manufacturer: "HealthPharm",
      },
      {
        id: "3-3",
        quantity: 2,
        expirationDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago (expired)
        batchNumber: "BC-54323",
        manufacturer: "HealthPharm",
      },
    ],
  },
  {
    id: "4",
    name: "MED D",
    batches: [
      {
        id: "4-1",
        quantity: 8,
        expirationDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now (valid)
        batchNumber: "BD-13579",
        manufacturer: "MedSupply",
      },
      {
        id: "4-2",
        quantity: 4,
        expirationDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 days from now (expiring soon)
        batchNumber: "BD-13580",
        manufacturer: "MedSupply",
      },
      {
        id: "4-3",
        quantity: 3,
        expirationDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago (expired)
        batchNumber: "BD-13581",
        manufacturer: "MedSupply",
      },
    ],
  },
  {
    id: "5",
    name: "MED E",
    batches: [
      {
        id: "5-1",
        quantity: 7,
        expirationDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        batchNumber: "BE-24680",
        manufacturer: "Wellness Labs",
      },
      {
        id: "5-2",
        quantity: 2,
        expirationDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        batchNumber: "BE-24681",
        manufacturer: "Wellness Labs",
      },
      {
        id: "5-3",
        quantity: 1,
        expirationDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        batchNumber: "BE-24682",
        manufacturer: "Wellness Labs",
      },
    ],
  },
  {
    id: "6",
    name: "MED F",
    batches: [
      {
        id: "6-1",
        quantity: 5,
        expirationDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
        batchNumber: "BF-36912",
        manufacturer: "LifeCare",
      },
      {
        id: "6-2",
        quantity: 6,
        expirationDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        batchNumber: "BF-36913",
        manufacturer: "LifeCare",
      },
      {
        id: "6-3",
        quantity: 2,
        expirationDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        batchNumber: "BF-36914",
        manufacturer: "LifeCare",
      },
    ],
  },
  {
    id: "7",
    name: "MED G",
    batches: [
      {
        id: "7-1",
        quantity: 10,
        expirationDate: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000),
        batchNumber: "BG-14725",
        manufacturer: "Biogenix",
      },
      {
        id: "7-2",
        quantity: 3,
        expirationDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
        batchNumber: "BG-14726",
        manufacturer: "Biogenix",
      },
      {
        id: "7-3",
        quantity: 2,
        expirationDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        batchNumber: "BG-14727",
        manufacturer: "Biogenix",
      },
    ],
  },
  {
    id: "8",
    name: "MED H",
    batches: [
      {
        id: "8-1",
        quantity: 11,
        expirationDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        batchNumber: "BH-85263",
        manufacturer: "ZenBio",
      },
      {
        id: "8-2",
        quantity: 2,
        expirationDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        batchNumber: "BH-85264",
        manufacturer: "ZenBio",
      },
      {
        id: "8-3",
        quantity: 3,
        expirationDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        batchNumber: "BH-85265",
        manufacturer: "ZenBio",
      },
    ],
  },
]

const MedicinesPage = () => {

    const [medicines] = useState<Medicine[]>(medicinesData)

  // Function to determine batch status
  const getBatchStatus = (expirationDate: Date) => {
    const today = new Date()
    const daysRemaining = differenceInDays(expirationDate, today)

    if (daysRemaining < 0) {
      return "expired"
    } else if (daysRemaining <= 7) {
      return "expiring-soon"
    } else {
      return "valid"
    }
  }

  // Function to calculate quantities by status for a medicine
  const getQuantitiesByStatus = (medicine: Medicine) => {
    const result = {
      valid: 0,
      expiringSoon: 0,
      expired: 0,
      total: 0,
    }

    medicine.batches.forEach((batch) => {
      const status = getBatchStatus(batch.expirationDate)
      result.total += batch.quantity

      if (status === "expired") {
        result.expired += batch.quantity
      } else if (status === "expiring-soon") {
        result.expiringSoon += batch.quantity
      } else {
        result.valid += batch.quantity
      }
    })

    return result
  }


  return (
    <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Medicine Inventory</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {medicines.map((medicine) => {
            const quantities = getQuantitiesByStatus(medicine)
            const manufacturer = medicine.batches[0]?.manufacturer || "Unknown"

            return (
            <Card key={medicine.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{medicine.name}</CardTitle>
                </div>
                </CardHeader>
                <CardContent>
                <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Quantity:</span>
                    <span className="font-medium">{quantities.total}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Manufacturer:</span>
                    <span className="font-medium">{manufacturer}</span>
                    </div>

                    <div className="space-y-2">
                    <div className="text-sm font-medium">Expiration Status:</div>

                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-sm">Valid</span>
                        </div>
                        <span className="text-sm font-medium">{quantities.valid}</span>
                    </div>

                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-amber-500 mr-2"></div>
                        <span className="text-sm">Expiring Soon</span>
                        </div>
                        <span className="text-sm font-medium">{quantities.expiringSoon}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                        <span className="text-sm">Expired</span>
                        </div>
                        <span className="text-sm font-medium">{quantities.expired}</span>
                    </div>
                    </div>

                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 flex">
                    {quantities.total > 0 && (
                        <>
                        <div
                            className="bg-green-500 transition-all"
                            style={{ width: `${(quantities.valid / quantities.total) * 100}%` }}
                        />
                        <div
                            className="bg-amber-500 transition-all"
                            style={{ width: `${(quantities.expiringSoon / quantities.total) * 100}%` }}
                        />
                        <div
                            className="bg-red-500 transition-all"
                            style={{ width: `${(quantities.expired / quantities.total) * 100}%` }}
                        />
                        </>
                    )}
                    </div>
                </div>
                </CardContent>
            </Card>
            )
        })}
        </div>
    </div>
  )
}

export default MedicinesPage