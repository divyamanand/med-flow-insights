
import { ref, onValue, off, get } from "firebase/database";
import { rtdb } from "./firebase";
import { RobotData } from "./types";

export const subscribeToRobotData = (
  callback: (data: RobotData) => void,
  errorCallback: (error: Error) => void
) => {
  const obstacleRef = ref(rtdb, '/obstacle');
  const directionRef = ref(rtdb, '/robot');
  
  try {
    const unsubscribe = onValue(
      obstacleRef,
      async (obstacleSnapshot) => {
        try {
          // Get obstacle data
          const obstacleData = obstacleSnapshot.val() || { left: 0, mid: 0, right: 0 };
          
          // Fetch direction data
          const directionSnapshot = await get(directionRef);
          const directionData = directionSnapshot.val();
          
          // Combine data
          const data: RobotData = {
            obstacle: obstacleData,
            direction: directionData?.direction || 'unknown'
          };
          
          console.log("Robot data updated:", data);
          callback(data);
        } catch (error) {
          console.error("Error fetching combined robot data:", error);
          errorCallback(error as Error);
        }
      },
      (error) => {
        console.error("Error fetching robot data:", error);
        errorCallback(error);
      }
    );

    // Also subscribe to direction changes
    const directionUnsubscribe = onValue(
      directionRef,
      (directionSnapshot) => {
        try {
          const directionData = directionSnapshot.val();
          if (directionData) {
            console.log("Direction updated:", directionData.direction);
            // We don't call the callback here as we're combining data above
          }
        } catch (error) {
          console.error("Error processing direction update:", error);
        }
      }
    );

    // Return a function that can be used to unsubscribe from both
    return () => {
      console.log("Unsubscribing from robot data");
      off(obstacleRef);
      off(directionRef);
    };
  } catch (error) {
    console.error("Error setting up robot data subscription:", error);
    errorCallback(error as Error);
    return () => {};  // Return empty function as fallback
  }
};
