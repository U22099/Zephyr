import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';

export const useSocket = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
    if (!serverUrl) {
      console.error("NEXT_PUBLIC_SERVER_URL environment variable not set.");
      return;
    }
    const newSocket = io(serverUrl);
    newSocket.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
    });

    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, []);


  return socket;
};