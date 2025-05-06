
import { ref, onValue, off, get } from "firebase/database";
import { rtdb } from "./firebase";
import { RobotData } from "./types";

export const subscribeToRobotData = (
  callback: (data: RobotData) => void,
  errorCallback: (error: Error) => void
) => {
  const obstacleRef = ref(rtdb, '/obstacle');
  const directionRef = ref(rtdb, '/robot');
  const rfidsRef = ref(rtdb, '/rfids');
  
  try {
    // Combined data object to keep track of latest values
    let combinedData: RobotData = {
      obstacle: { left: 0, mid: 0, right: 0 },
      direction: 'unknown',
      rfids: {}
    };

    // Subscribe to obstacle updates
    const obstacleUnsubscribe = onValue(
      obstacleRef,
      (obstacleSnapshot) => {
        try {
          // Update obstacle data
          const obstacleData = obstacleSnapshot.val() || { left: 0, mid: 0, right: 0 };
          combinedData = {
            ...combinedData,
            obstacle: obstacleData
          };
          
          console.log("Obstacle data updated:", obstacleData);
          callback(combinedData);
        } catch (error) {
          console.error("Error processing obstacle update:", error);
          errorCallback(error as Error);
        }
      },
      (error) => {
        console.error("Error fetching obstacle data:", error);
        errorCallback(error);
      }
    );

    // Subscribe to direction updates separately
    const directionUnsubscribe = onValue(
      directionRef,
      (directionSnapshot) => {
        try {
          const directionData = directionSnapshot.val();
          if (directionData) {
            console.log("Direction updated:", directionData.direction);
            combinedData = {
              ...combinedData,
              direction: directionData.direction
            };
            
            // Call the callback with updated combined data
            callback(combinedData);
          }
        } catch (error) {
          console.error("Error processing direction update:", error);
          errorCallback(error as Error);
        }
      },
      (error) => {
        console.error("Error fetching direction data:", error);
        errorCallback(error);
      }
    );

    // Subscribe to RFID updates
    const rfidsUnsubscribe = onValue(
      rfidsRef,
      (rfidsSnapshot) => {
        try {
          const rfidsData = rfidsSnapshot.val() || {};
          console.log("RFID data updated:", rfidsData);
          combinedData = {
            ...combinedData,
            rfids: rfidsData
          };
          
          // Call the callback with updated combined data
          callback(combinedData);
        } catch (error) {
          console.error("Error processing RFID update:", error);
          errorCallback(error as Error);
        }
      },
      (error) => {
        console.error("Error fetching RFID data:", error);
        errorCallback(error);
      }
    );

    // Return a function that can be used to unsubscribe from all
    return () => {
      console.log("Unsubscribing from robot data");
      obstacleUnsubscribe();
      directionUnsubscribe();
      rfidsUnsubscribe();
    };
  } catch (error) {
    console.error("Error setting up robot data subscription:", error);
    errorCallback(error as Error);
    return () => {};  // Return empty function as fallback
  }
};
