import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { useUserData, usePage, useUID, useSocket } from "@/store";
import { generateToken } from "@/utils";
import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';

const ZegoExpressEngine = dynamic(() => import('zego-express-engine-webrtc'), {
  ssr: false,
});

export function VoiceCall() {
  const { page, setPage } = usePage();
  const userData = useUserData(state => state.userData);
  const uid = useUID(state => state.uid);
  const socket = useSocket(state => state.socket);
  const [zego, setZego] = useState();
  const [incoming, setIncoming] = useState();
  const [localStream, setLocalStream] = useState();
  const [remoteUsers, setRemoteUsers] = useState([]);

  const joinRoom = async (roomID, token) => {
    await zego.loginRoom(roomID, token, { userID: uid, userName: userData.username }, { userUpdate: true });
    const localStream = await zego.createStream({
      camera: {
        audio: true,
        video: false
      }
    });
    await zego.startPublishingStream(`${Date.now()}`, localStream);
    setLocalStream(localStream);
    zego.on("roomStreamUpdate", async (roomID, updateType, streamList, extendedData) => {
      if (updateType === "ADD") {
        console.log(streamList);
        streamList.forEach(async stream => {
          const streamed = await zego.startPlayingStream(stream.streamID, {
            audio: true,
            video: true
          });

          setRemoteUsers([
            ...remoteUsers,
            {
              streamID: stream.streamID,
              stream: streamed
            }
          ]);
        });
      } else if (updateType === "DELETE" && zego && localStream && streamList) {
        endCall(streamList);
      }
    });
  }
  const endCall = (streamList) => {
    if (zego && localStream) {
      streamList.forEach(stream => zego.stopPublishingStream(stream.streamID));
      zego.destroyStream(localStream);
      zego.logoutRoom(roomID);
    }
    setPage({
      open: true,
      component: "chat",
      data: {
        ...page.data,
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
        socket.on("voice-call-accepted", async data => {
          if (page.data.uid === data.from) {
            await joinRoom(data.roomID, token);
          }
        })
      } else if (page.data.incoming && zego) {
        await joinRoom(page.data.roomID, token);
      }
    }
    connect();
  }, [socket, zego]);

  return (
    <main className="h-screen p-2 flex justify-center items-center text-center">
      {!remoteUsers&&<p className="text-2xl text-primary font-bold">Calling...</p>}
      <section className="grid gap-4 grid-cols-[repeat(auto-fill, minmax(200px, 1fr))] h-full">
        {remoteUsers.map(user => <UserCard key={user.streamID} user={user} />)}
      </section>
      <Button onClick={() => endCall(remoteUsers)} className="mx-auto" >End Call</Button>
    </main>
  )
}

const UserCard = ({ user }) => {
  useEffect(() => {
    const aud = document.getElementById("aud" + user.streamID);
    aud.muted = false;
    aud.playsinline = true;
    aud.autoplay = true;
    aud.srcObject = user.stream;
  }, []);
  return (
    <Card>
      <CardContent className="flex justify-center items-center flex-col">
        <audio id={"aud"+user.streamID} hidden />
        <Avatar className="w-20 h-20">
          <AvatarImage className="w-20 h-20 object-cover rounded-full" src={user.image} alt="profile-image"/>
          <AvatarFallback className="text-3xl text-primary">{user.name ? user.name[0] : "Z"}</AvatarFallback>
        </Avatar>
        <h3 className="max-w-40 truncate">{user.name}</h3>
      </CardContent>
    </Card>
  )
}