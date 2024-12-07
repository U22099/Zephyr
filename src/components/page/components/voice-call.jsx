import { useState, useEffect, useRef } from "react";
import { useUserData, usePage, useUID, useSocket } from "@/store";
import { IoClose } from "react-icons/io5";

export function VoiceCall() {
  const element = useRef();
  const { page, setPage } = usePage();
  const userData = useUserData(state => state.userData);
  const uid = useUID(state => state.uid);
  const socket = useSocket(state => state.socket);
  useEffect(() => {
    const startCall = async () => {
      const { ZegoUIKitPrebuilt } = await import("@zegocloud/zego-uikit-prebuilt");
      if (!page.data.incoming) {
        const roomID = `3664${Date.now()}393`
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(parseInt(process.env.NEXT_PUBLIC_ZEGO_APP_ID), process.env.NEXT_PUBLIC_ZEGO_SERVER_ID, roomID, uid, userData.username);
        const zp = ZegoUIKitPrebuilt.create(kitToken);
        zp.joinRoom({
          container: element.current,
          scenario: {
            mode: page.data.type === "personal" ? ZegoUIKitPrebuilt.OneONoneCall : ZegoUIKitPrebuilt.GroupCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
          },
          onLeaveRoom: () => {
            setPage({
              open: true,
              component: "chat",
              data: {
                ...page.data
              }
            });
          }
        });
        if (page.data.type === "group") {
          socket.emit("group-outgoing-voice-call", {
            to: page.data.uid,
            from: uid,
            roomID,
            type: "group"
          });
        } else {
          socket.emit("outgoing-voice-call", {
            to: page.data.uid,
            from: uid,
            roomID,
            type: "personal"
          });
        }
      } else {
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(parseInt(process.env.NEXT_PUBLIC_ZEGO_APP_ID), process.env.NEXT_PUBLIC_ZEGO_SERVER_ID, page.data.roomID, uid, userData.username);
        const zp = ZegoUIKitPrebuilt.create(kitToken);
        zp.joinRoom({
          container: element.current,
          scenario: {
            mode: page.data.type === "personal" ? ZegoUIKitPrebuilt.OneONoneCall : ZegoUIKitPrebuilt.GroupCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
          },
          onLeaveRoom: () => {
            setPage({
              open: true,
              component: "chat",
              data: {
                ...page.data.doc
              }
            });
          }
        });
      }
    }

    startCall();
  }, []);
  return (
    <main className="flex flex-col h-full w-full gap-4">
      <header className="flex justify-start w-full p-2">
        <div className="p-2 rounded-full bg-muted flex justify-center items-center w-12 h-12" onClick={() => setPage({
            open: true,
            component: "chat",
            data: page.data.doc ? page.data.doc : page.data
        })}>
          <IoClose className="text-xl fill-black dark:fill-white"/>
        </div>
      </header>
      <section ref={element}></section>
    </main>
  );
}





/*import {
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
    try{
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
              video: false
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
    } catch(err) {
      console.log(err);
    }
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
      console.log(token)
      if (socket && !page.data.incoming && zego) {
        const roomID = `108${Date.now()}297`;
        socket.emit("outgoing-voice-call", {
          from: uid,
          to: page.data.uid,
          roomID,
          userData: {
            image: userData.image,
            name: userData.username
          }
        });
        socket.on("voice-call-accepted", async data => {
          if (page.data.uid === data.from) {
            await joinRoom(data.roomID, token);
          }
        });
        socket.on("voice-call-rejected", () => {
          setPage({
            open: true,
            component: "chat",
            data: {
              ...page.data,
            }
          });
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
}*/