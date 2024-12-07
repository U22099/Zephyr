import { useState, useEffect, useRef } from "react";
import { useUserData, usePage, useUID, useSocket } from "@/store";

export function VideoCall() {
  const element = useRef();
  const { page, setPage } = usePage();
  const uid = useUID(state => state.uid);
  const socket = useSocket(state => state.socket);
  useEffect(() => {
    const startCall = async () => {
      const { ZegoUIKitPrebuilt } = await import("@zegocloud/zego-uikit-prebuilt");
      if (!page.data.incoming) {
        const roomID = `3664${Date.now()}393`
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(parseInt(process.env.NEXT_PUBLIC_ZEGO_APP_ID), process.env.NEXT_PUBLIC_ZEGO_SERVER_ID, roomID, uid, Math.random() * 50000);
        const zp = ZegoUIKitPrebuilt.create(kitToken);
        const url = window.location.protocol + '//' + window.location.host + window.location.pathname + '?roomID=' + roomID;
        zp.joinRoom({
          container: element.current,
          sharedLinks: [
            {
              name: 'Personal link',
              url
                },
          ],
          scenario: {
            mode: ZegoUIKitPrebuilt.VideoConference, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
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
        socket.emit("outgoing-video-call", {
          to: page.data.uid,
          from: uid,
          roomID,
          url,
          type: page.data.type
        });
      } else {
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(parseInt(process.env.NEXT_PUBLIC_ZEGO_APP_ID), process.env.NEXT_PUBLIC_ZEGO_SERVER_ID, page.data.roomID, uid, Math.random() * 50000);
        const zp = ZegoUIKitPrebuilt.create(kitToken);
        zp.joinRoom({
          container: element.current,
          sharedLinks: [
            {
              name: 'Personal link',
              url: page.data.url
                },
          ],
          scenario: {
            mode: ZegoUIKitPrebuilt.VideoConference, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
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
      }
    }
    startCall();
  }, []);
  return (
    <main ref={element}>
    </main>
  );
}