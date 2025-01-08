import { useState, useEffect, useRef } from "react";
import { useUserData, usePage, useUID, useSocket } from "@/store";
 import { useToast } from "@/hooks/use-toast";

export function VoiceCall() {
  const element = useRef();
  const { page, setPage } = usePage();
  const userData = useUserData(state => state.userData);
  const uid = useUID(state => state.uid);
  const socket = useSocket(state => state.socket);
  
  const { toast } = useToast();
  useEffect(() => {
    const startCall = async () => {
      try {
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
              mode: page.data.type === "personal" ? ZegoUIKitPrebuilt.OneONoneCall : ZegoUIKitPrebuilt.GroupCall,
            },
            onLeaveRoom: () => {
              socket.emit("call-ended", page.data.uid)
              setPage({
                open: false,
                component: "default",
              });
            }
          });
          if (page.data.type === "group") {
            socket.emit("group-outgoing-voice-call", {
              to: page.data.uid,
              from: uid,
              name: page.data.name,
              roomID,
              type: "group"
            });
          } else {
            socket.emit("outgoing-voice-call", {
              to: page.data.uid,
              from: uid,
              name: page.data.name,
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
              mode: page.data.type === "personal" ? ZegoUIKitPrebuilt.OneONoneCall : ZegoUIKitPrebuilt.GroupCall,
            },
            onLeaveRoom: () => {
              if (page.data.type === "personal") {
                socket.emit("call-ended", page.data.to)
              }
              setPage({
                open: false,
                component: "default",
              });
            }
          });
        }
      } catch (error) {
        console.error("Error starting call:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "An error occured, please try again"
        })
        setPage({
          open: false,
          component: "default",
        });
      }
    }
    startCall();
  }, []);
  return (
    <main className="flex flex-col h-full w-full gap-4 items-center justify-center">
      <section ref={element} className="mt-5 bg-none backdrop-blur-sm p-3 rounded"></section>
    </main>
  );
}