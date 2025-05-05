
import { ref, onValue, off } from "firebase/database";
import { rtdb } from "./firebase";
import { RobotData } from "./types";

export const subscribeToRobotData = (
  callback: (data: RobotData) => void,
  errorCallback: (error: Error) => void
) => {
  const robotRef = ref(rtdb, '/');
  
  try {
    const unsubscribe = onValue(
      robotRef,
      (snapshot) => {
        const rawData = snapshot.val();
        if (rawData) {
          // Extract only the obstacle part for our simplified RobotData type
          const data: RobotData = {
            obstacle: rawData.obstacle || { left: 0, mid: 0, right: 0 }
          };
          console.log("Robot obstacle data updated:", data);
          callback(data);
        } else {
          console.warn("No robot data available from Firebase");
          errorCallback(new Error("No robot data available"));
        }
      },
      (error) => {
        console.error("Error fetching robot data:", error);
        errorCallback(error);
      }
    );

    // Return a function that can be used to unsubscribe
    return () => {
      console.log("Unsubscribing from robot data");
      off(robotRef);
    };
  } catch (error) {
    console.error("Error setting up robot data subscription:", error);
    errorCallback(error as Error);
    return () => {};  // Return empty function as fallback
  }
};
