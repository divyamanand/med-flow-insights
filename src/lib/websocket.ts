// WebSocket placeholder for robot real-time data
// TODO: Implement Socket.io client when backend WebSocket is ready

export const subscribeToRobotData = (
  onData: (data: any) => void,
  onError: (error: Error) => void
) => {
  // Using demo data for now
  const demoData = {
    obstacle: { left: 0, mid: 0, right: 0 },
    direction: 'forward',
    rfids: {}
  };
  
  setTimeout(() => onData(demoData), 100);
  
  return () => {};
};
