import { useState, useEffect, useRef } from "react";
import { useUserData, usePage, useUID, useSocket } from "@/store";

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
          turnOnMicrophoneWhenJoining: false,
          turnOnCameraWhenJoining: false,
          showMyCameraToggleButton: false,
          showAudioVideoSettingsButton: false,
          showScreenSharingButton: false,
          showPreJoinView: true,
          showLeavingView: false,
          maxUsers: page.data.type === "group" ? 1000 : 2,
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
          turnOnMicrophoneWhenJoining: false,
          turnOnCameraWhenJoining: false,
          showMyCameraToggleButton: false,
          showAudioVideoSettingsButton: false,
          showScreenSharingButton: false,
          showPreJoinView: true,
          showLeavingView: false,
          maxUsers: page.data.type === "group" ? 1000 : 2,
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
      <section ref={element} className="bg-none backdrop-blur-sm p-3 rounded"></section>
    </main>
  );
}