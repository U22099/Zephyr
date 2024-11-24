import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';
import { updateUserData, getCurrentDate } from "@/utils";
import { useUID } from "@/store";

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const uid = useUID(state => state.uid);

  useEffect(() => {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
    if (!serverUrl) {
      console.error("NEXT_PUBLIC_SERVER_URL environment variable not set.");
      return;
    }
    const newSocket = io(serverUrl);
    newSocket.on('connect', async () => {
      console.log(uid);
      await updateUserData(uid, {
        active: "online",
      });
    });

    newSocket.on('disconnect', async () => {
      const time = getCurrentDate();
      await updateUserData(uid, {
        active: `last seen ${time}`,
      });
    });

    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, []);


  return socket;
}; 