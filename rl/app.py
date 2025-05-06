from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
from stable_baselines3 import DQN
from hospital_env.HospitalEnv import HospitalInventoryEnvv  # Update with correct import if needed

app = FastAPI()

# Initialize environment and load model
env = HospitalInventoryEnvv()
model = DQN.load("dqn_inventory")  # Ensure this file is in your working directory

# Define input data model
class Observation(BaseModel):
    inventory: list[float]
    pipeline: list[float]
    forecast: float

@app.post("/predict/")
def predict(obs: Observation):
    # Ensure the observation matches the expected input shape
    obs_array = np.array(obs.inventory + obs.pipeline + [obs.forecast], dtype=np.float32)
    action, _ = model.predict(obs_array, deterministic=True)
    return {"action": int(action)}

