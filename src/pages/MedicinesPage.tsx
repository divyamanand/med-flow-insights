import React from 'react'
import { useState,useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { differenceInDays } from "date-fns"
import { getCollection } from '@/lib/firestore'
import { Medicine,MedicineBatch } from '@/lib/types'

const MedicinesPage = () => {

  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const medicinesData : Medicine[] = await getCollection("medicine") as Medicine[]
        setMedicines(medicinesData);
      } catch (err) {
        setError("Failed to fetch medicines");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, []);

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

  if (loading) {
    return <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="text-lg font-medium">Connecting to Firebase...</p>
        </div>
      </div>
  }


  return (
    <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Medicine Inventory</h1>
      
        
            <div className="m-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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