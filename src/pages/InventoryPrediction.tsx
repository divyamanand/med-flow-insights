import React, { useState } from 'react';
import axios from 'axios';

function InventoryPredictor() {
  const [obs, setObs] = useState({ inventory: [], pipeline: [], forecast: 0 });
  const [action, setAction] = useState(null);

  const sendObservation = async () => {
    const response = await axios.post('http://localhost:8000/predict/', obs);
    setAction(response.data.action);
  };

  return (
    <div>
      <h2>Inventory Predictor</h2>
      <button onClick={sendObservation}>Predict Action</button>
      {action !== null && <p>Recommended Order: {action}</p>}
    </div>
  );
}

export default InventoryPredictor;
