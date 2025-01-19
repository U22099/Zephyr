 "use client";
 import { Navigation } from "@/components/home/navigation";
 import { Updates } from "@/components/home/updates";
 import { People } from "@/components/home/people";
 import { Chats } from "@/components/home/chats";
 import { Settings } from "@/components/home/settings";
 import { Loading } from "@/components/loading";
 import { Page } from "@/components/page/pages";
 import { useNav, useUserData, useUID, usePage, useSocket, useDraft } from "@/store";
 import { getUserData, updateUserData } from "@/utils";
 import { useEffect, useState } from "react";
 import { useAuthState } from "react-firebase-hooks/auth";
 import { auth } from "@/firebase";
 import { useIsMobile } from "@/hooks/use-mobile";
 import { io } from 'socket.io-client';
 import { deleteSession } from "@/lib/utility/index";
 import { getSession } from "@/lib/utility/index";
 import { useRouter } from "next/navigation";
 import { useToast } from "@/hooks/use-toast";
 import { toast as sonnerToast } from "sonner";

 export default function Home() {
   const router = useRouter();
   const socket = io(process.env.NEXT_PUBLIC_SERVER_URL);
   const setSocket = useSocket(state => state.setSocket);
   const { toast } = useToast();
   const setDraft = useDraft(state => state.setDraft);
   const isMobile = useIsMobile();
   const [user, userLoading] = useAuthState(auth);
   const { nav, setNav } = useNav();
   const [loading, setLoading] = useState(true);
   const setUserData = useUserData(state => state.setUserData);
   const setUID = useUID(state => state.setUID);
   const { page, setPage } = usePage();

   const handleIncomingVoiceCall = (data) => {
     sonnerToast(data.name,{ description: "Incoming voice call...", duration: 20000,
         action: {
           label: "Accept",
           onClick: () => setPage({
             open: true,
             component: "voice-call",
             data: { ...data, incoming: true }
           })
         }
       });
   }

   const handleIncomingVideoCall = (data) => {
     sonnerToast(data.name,{ description: "Incoming video call...", duration: 20000,
         action: {
           label: "Accept",
           onClick: () => setPage({
             open: true,
             component: "video-call",
             data: { ...data, incoming: true }
           })
         }
       });
   }

   const handleGroupRecieveMessage = (data) => {
     toast({
       title: data.name,
       description: `~${data.senderName}: ${data.type === "text" ? (data.content.length > 70 ? `${data.content.slice(0, 70)}...` : data.content) : data.type}`,
     });
   };

   const handleRecieveMessage = (data) => {
     toast({
       title: data.name,
       description: `${data.type === "text" ? (data.content.length > 70 ? `${data.content.slice(0, 70)}...` : data.content) : data.type}`,
     });
   };
   const init = async () => {
     try {
       setDraft(JSON.parse(localStorage.getItem("draft")) || []);
       const id = user.uid === "U2YAfwTchcTNmgZxP4bDsoUUdEk2" ? process.env.NEXT_PUBLIC_UID : user.uid;
       await getUserData(id, setUserData);
       setUID(id);
       socket.emit("add-user", id);
       socket.on("connection", (id) => {
         socket.emit("add-user", id);
       });
       socket.on("group-recieve-message", handleGroupRecieveMessage);
       socket.on("recieve-message", handleRecieveMessage);
       socket.on("group-incoming-voice-call", handleIncomingVoiceCall);
       socket.on("incoming-voice-call", handleIncomingVoiceCall);
       socket.on("group-incoming-video-call", handleIncomingVideoCall);
       socket.on("incoming-video-call", handleIncomingVideoCall);
       setSocket(socket);
     } catch (err) {
       console.log(err, err.message, "init");
     } finally {
       setLoading(false);
     }
   }
   
   useEffect(() => {
     if (user) {
       init();
     } else if (!user && !userLoading) {
       deleteSession();
       router.push("/");
     }
     return () => {
       socket.off("group-recieve-message", handleGroupRecieveMessage);
       socket.off("recieve-message", handleRecieveMessage);
       socket.off("group-incoming-voice-call", handleIncomingVoiceCall);
       socket.off("incoming-voice-call", handleIncomingVoiceCall);
       socket.off("group-incoming-video-call", handleIncomingVideoCall);
       socket.off("incoming-video-call", handleIncomingVideoCall);
       socket.disconnect();
     }
   }, [user, userLoading]);
   return (
     <>
    { loading ? 
    <Loading /> 
    : (page.open&&isMobile) ? 
      <section className="flex h-screen items-start justify-start w-full scrollbar overflow-y-scroll">
        <Page />
      </section>
      : <main className={isMobile ? "flex h-full flex-col items-start justify-start w-full scrollbar overflow-hidden max-h-screen" : "grid h-full w-full scrollbar grid-cols-6 overflow-hidden max-h-screen"}>
        <section className={"flex h-full flex-col w-full items-start justify-start" + (!isMobile ? " col-span-2" : "")}>
        { nav === 0 ? <Updates /> 
        : nav === 1 ? <People />
        : nav === 2 ? <Chats />
        : nav === 3 ? <Settings /> 
        : <Chats />}
        <Navigation setNav={setNav} nav={nav}/>
        </section>
        {!isMobile&&
        <section className="col-span-4 w-full flex justify-center items-start overflow-y-scroll h-full">
          <Page/>
        </section>}
    </main>}
    </>
   )
 }