
import { io } from "socket.io-client";
import { createContext, useEffect, useState } from "react";

export const SocketContext = createContext(null);

const SocketProvider = ({ children }) => {
  const [socketInstance, setSocketInstance] = useState(null);

  useEffect(() => {
    const socket = io("http://localhost:8080");
    setSocketInstance(socket);

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket: socketInstance }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
