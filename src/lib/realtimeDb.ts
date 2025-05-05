
import { ref, onValue, off } from "firebase/database";
import { rtdb } from "./firebase";
import { RobotData } from "./types";

export const subscribeToRobotData = (
  callback: (data: RobotData) => void,
  errorCallback: (error: Error) => void
) => {
  const robotRef = ref(rtdb, '/');
  
  const unsubscribe = onValue(
    robotRef,
    (snapshot) => {
      const data = snapshot.val() as RobotData;
      callback(data);
    },
    (error) => {
      console.error("Error fetching robot data:", error);
      errorCallback(error);
    }
  );

  // Return a function that can be used to unsubscribe
  return () => off(robotRef);
};
