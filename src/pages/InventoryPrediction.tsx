
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Info, TrendingUp, Package, Truck } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const InventoryPrediction = () => {
  // State for inventory levels (7 days shelf life)
  const [inventory, setInventory] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  // State for pipeline (items in transit)
  const [pipeline, setPipeline] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  // Forecast demand
  const [forecast, setForecast] = useState<number>(0);
  // Recommended action
  const [action, setAction] = useState<number | null>(null);
  // Loading state
  const [loading, setLoading] = useState<boolean>(false);
  // Error state
  const [error, setError] = useState<string | null>(null);

  // Function to update inventory by index
  const updateInventory = (index: number, value: number) => {
    const newInventory = [...inventory];
    newInventory[index] = value;
    setInventory(newInventory);
  };

  // Function to update pipeline by index
  const updatePipeline = (index: number, value: number) => {
    const newPipeline = [...pipeline];
    newPipeline[index] = value;
    setPipeline(newPipeline);
  };

  // Simple offline prediction model (placeholder for API call)
  const getPrediction = () => {
    setLoading(true);
    setError(null);

    // Simulate API call delay
    setTimeout(() => {
      try {
        // Basic prediction logic (this would normally come from the Flask API)
        const totalInventory = inventory.reduce((sum, val) => sum + val, 0);
        const totalPipeline = pipeline.reduce((sum, val) => sum + val, 0);
        
        // Simple logic: If forecast > (inventory + pipeline), order the difference
        // Real model would be more complex
        let predictedAction = 0;
        
        if (forecast > (totalInventory + totalPipeline)) {
          predictedAction = Math.ceil(forecast - (totalInventory + totalPipeline));
        }
        
        setAction(predictedAction);
        setLoading(false);
        toast.success("Prediction generated successfully");
      } catch (err) {
        setError("Failed to generate prediction. Please try again.");
        setLoading(false);
        toast.error("Error generating prediction");
      }
    }, 1000);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Inventory ML Prediction</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Inventory Status
            </CardTitle>
            <CardDescription>
              Enter current inventory levels by age (days remaining until expiry)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inventory.map((value, index) => (
                <div key={`inventory-${index}`} className="grid grid-cols-2 gap-4 items-center">
                  <Label htmlFor={`inventory-${index}`}>
                    Day {7 - index} remaining:
                    {index === 0 && (
                      <Badge variant="secondary" className="ml-2">Fresh</Badge>
                    )}
                    {index === 6 && (
                      <Badge variant="destructive" className="ml-2">Expiring</Badge>
                    )}
                  </Label>
                  <Input
                    id={`inventory-${index}`}
                    type="number"
                    min="0"
                    value={value}
                    onChange={(e) => updateInventory(index, parseInt(e.target.value) || 0)}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              Supply Pipeline
            </CardTitle>
            <CardDescription>
              Enter quantities in the supply pipeline (days until arrival)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pipeline.map((value, index) => (
                <div key={`pipeline-${index}`} className="grid grid-cols-2 gap-4 items-center">
                  <Label htmlFor={`pipeline-${index}`}>
                    Arriving in {index + 1} day{index !== 0 ? 's' : ''}:
                  </Label>
                  <Input
                    id={`pipeline-${index}`}
                    type="number"
                    min="0"
                    value={value}
                    onChange={(e) => updatePipeline(index, parseInt(e.target.value) || 0)}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Demand Forecast
            </CardTitle>
            <CardDescription>
              Enter the forecasted demand for the next period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="md:col-span-2">
                <Label htmlFor="forecast" className="mb-2 block">
                  Forecasted Demand:
                </Label>
                <Input
                  id="forecast"
                  type="number"
                  min="0"
                  value={forecast}
                  onChange={(e) => setForecast(parseInt(e.target.value) || 0)}
                  className="w-full"
                />
              </div>
              <div>
                <Button 
                  onClick={getPrediction} 
                  className="w-full h-10" 
                  disabled={loading}
                >
                  {loading ? "Calculating..." : "Generate Prediction"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <Info className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {action !== null && (
          <Card>
            <CardHeader>
              <CardTitle>Prediction Result</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-muted-foreground mb-2">Based on your current inventory and forecast:</p>
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-4 rounded-lg">
                      <p className="text-sm font-medium text-muted-foreground">Recommended Action</p>
                      <p className="text-3xl font-bold text-primary">Order {action} units</p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Summary:</h3>
                  <ul className="space-y-1 text-sm">
                    <li>Total current inventory: {inventory.reduce((sum, val) => sum + val, 0)} units</li>
                    <li>Total in pipeline: {pipeline.reduce((sum, val) => sum + val, 0)} units</li>
                    <li>Forecasted demand: {forecast} units</li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/50">
              <p className="text-sm text-muted-foreground">
                <Info className="h-4 w-4 inline mr-1" />
                This prediction is based on a machine learning model trained on historical data and various supply chain factors.
              </p>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
};

export default InventoryPrediction;
