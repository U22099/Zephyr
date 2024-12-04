import { useUserData, usePage, useUID, useSocket } from "@/store";
import { generateToken } from "@/utils";
import { useState, useEffect } from "react";
import { ZegoExpressEngine } from "zego-express-engine-webrtc";

export function VoiceCall() {
  const { page, setPage } = usePage();
  const userData = useUserData(state => state.userData);
  const uid = useUID(state => state.uid);
  const socket = useSocket(state => state.socket);
  const [zego, setZego] = useState();
  const [incoming, setIncoming] = useState();
  const [localAudioStream, setLocalAudioStream] = useState();

  const joinRoom = async (roomID, token) => {
    await zego.loginRoom(roomID, token, { userID: uid, userName: userData.username }, { userUpdate: true });
    const localStream = await zego.createStream({
      camera: {
        audio: true,
        video: false
      }
    });
    await zego.startPublishingStream(`${Date.now()}`, localStream);
    setLocalAudioStream(localStream);
    zego.on("roomStreamUpdate", async (roomID, updateType, streamList, extendedData) => {
      if (updateType === "ADD") {
        //update UI
      } else if (updateType === "DELETE" && zego && localStream && streamList[0].streamID) {
        zego.destroyStream(localStream);
        zego.stopPublishingStream(localStream);
        zego.logoutRoom(roomID);
        setPage({
          open: true,
          component: "chat",
          data: {
            ...page.data,
          }
        });
      }
    });
  }
  useEffect(() => {
    const zg = new ZegoExpressEngine(process.env.NEXT_PUBLIC_ZEGO_APP_ID, process.env.NEXT_PUBLIC_ZEGO_SERVER_ID);
    setZego(zg);
  }, []);

  useEffect(() => {
    const connect = async () => {
      const token = await generateToken(uid);
      if (socket && !page.data.incoming && zego) {
        const roomID = `108${Date.now()}297`;
        socket.emit("outgoing-voice-call", {
          from: uid,
          to: page.data.uid,
          roomID,
        });
        socket.on("voice-call-accepted", data => {
          if (page.data.uid === data.uid) {
            await joinRoom(roomID, token);
          }
        })
      } else if (page.data.incoming && zego) {
        await joinRoom(page.data.roomID, token);
      }
    }
    connect();
  }, [socket, zego]);
}