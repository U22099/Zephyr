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
          showPreJoinView: false,
          turnOnMicrophoneWhenJoining: false,
          turnOnCameraWhenJoining: false,
          maxUsers: page.data.type === "group" ? 1000 : 2,
          scenario: {
            mode: ZegoUIKitPrebuilt.VideoConference
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
          socket.emit("group-outgoing-video-call", {
            to: page.data.uid,
            from: uid,
            roomID,
            type: "group"
          });
        } else {
          socket.emit("outgoing-video-call", {
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
          showPreJoinView: false,
          turnOnMicrophoneWhenJoining: false,
          turnOnCameraWhenJoining: false,
          maxUsers: page.data.type === "group" ? 1000 : 2,
          scenario: {
            mode: ZegoUIKitPrebuilt.VideoConference
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
      <section ref={element}></section>
    </main>
  );
}