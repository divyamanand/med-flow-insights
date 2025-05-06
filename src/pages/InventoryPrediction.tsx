
import React, { useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from '@/components/ui/use-toast';

function InventoryPredictor() {
  const [obs, setObs] = useState({ 
    inventory: [0, 0, 0], 
    pipeline: [0, 0, 0], 
    forecast: 0 
  });
  const [action, setAction] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInventoryChange = (index: number, value: string) => {
    const newInventory = [...obs.inventory];
    newInventory[index] = parseInt(value) || 0;
    setObs({ ...obs, inventory: newInventory });
  };

  const handlePipelineChange = (index: number, value: string) => {
    const newPipeline = [...obs.pipeline];
    newPipeline[index] = parseInt(value) || 0;
    setObs({ ...obs, pipeline: newPipeline });
  };

  const handleForecastChange = (value: string) => {
    setObs({ ...obs, forecast: parseInt(value) || 0 });
  };

  const sendObservation = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post('http://localhost:8000/predict/', obs);
      setAction(response.data.action);
      toast({
        title: "Prediction Complete",
        description: "Successfully retrieved inventory prediction.",
      });
    } catch (error) {
      console.error('Error sending observation:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get prediction. Is the server running?",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Inventory Prediction</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Input Parameters</CardTitle>
            <CardDescription>Enter inventory data for prediction</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Current Inventory</Label>
              <div className="flex gap-2">
                {[0, 1, 2].map((index) => (
                  <Input
                    key={`inventory-${index}`}
                    type="number"
                    placeholder={`Item ${index + 1}`}
                    value={obs.inventory[index] || 0}
                    onChange={(e) => handleInventoryChange(index, e.target.value)}
                  />
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Pipeline</Label>
              <div className="flex gap-2">
                {[0, 1, 2].map((index) => (
                  <Input
                    key={`pipeline-${index}`}
                    type="number"
                    placeholder={`Item ${index + 1}`}
                    value={obs.pipeline[index] || 0}
                    onChange={(e) => handlePipelineChange(index, e.target.value)}
                  />
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Forecast</Label>
              <Input
                type="number"
                value={obs.forecast}
                onChange={(e) => handleForecastChange(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={sendObservation} disabled={isLoading}>
              {isLoading ? "Processing..." : "Generate Prediction"}
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Prediction Results</CardTitle>
            <CardDescription>Recommended inventory action</CardDescription>
          </CardHeader>
          <CardContent>
            {action !== null ? (
              <div className="p-4 bg-primary/10 rounded-md">
                <h3 className="font-semibold mb-2">Recommended Order:</h3>
                <p className="text-2xl font-bold">{action}</p>
              </div>
            ) : (
              <div className="p-4 bg-muted rounded-md text-center">
                <p>No prediction yet. Please enter values and generate a prediction.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default InventoryPredictor;
