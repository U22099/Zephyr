 "use client";
import { Navigation } from "@/components/home/navigation";
import { Updates } from "@/components/home/updates";
import { People } from "@/components/home/people";
import { Chats } from "@/components/home/chats";
import { Settings } from "@/components/home/settings";
import { Loading } from "@/components/loading";
import { Page } from "@/components/page/pages";
import { useNav, useUserData, useUID, usePage, useSocket } from "@/store";
import { getUserData, updateUserData } from "@/utils";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import { useIsMobile } from "@/hooks/use-mobile";
import { io } from 'socket.io-client';
import { deleteSession } from "@/lib/utility/index";
import { getSession } from "@/lib/utility/index";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    if(!(JSON.parse(localStorage.getItem("logged")))){
      router.push("/");
    }
  }, [router]);
  const socket = io(process.env.NEXT_PUBLIC_SERVER_URL);
  const setSocket = useSocket(state => state.setSocket);
  const isMobile = useIsMobile();
  const [user] = useAuthState(auth);
  const { nav, setNav } = useNav();
  const [loading, setLoading] = useState(true);
  const setUserData = useUserData(state => state.setUserData); 
  const setUID = useUID(state => state.setUID);
  const page = usePage(state => state.page);
  const init = async () => {
    try{
      await getUserData(user.uid, setUserData);
      setUID(user.uid);
      socket.emit("add-user", user.uid);
      socket.on("connection", (id) => {
        socket.emit("add-user", user.uid);
      });
      setSocket(socket);
    } catch(err) {
      console.log(err, err.message, "init");
    } finally{
      setLoading(false);
    }
  }
  useEffect(() => {
    //deleteSession();
    if (user) {
      init();
    }
    return () => {
      socket.disconnect();
    }
  }, [user]);
  return (
    <>
    { loading ? 
    <Loading /> 
    : (page.open&&isMobile) ? 
      <section className="flex h-full flex-col items-start justify-start w-full">
        <Page />
      </section>
      : <main className={isMobile ? "flex h-full flex-col items-start justify-start w-full scrollbar" : " grid h-full p-2 grid-cols-6"}>
        <section className={"flex h-full flex-col items-start justify-start w-full scrollbar" + !isMobile&&" col-span-2"}>
        { nav === 0 ? <Updates /> 
        : nav === 1 ? <People />
        : nav === 2 ? <Chats />
        : nav === 3 ? <Settings /> 
        : <Chats />}
        <Navigation setNav={setNav} nav={nav}/>
        </section>
        {!isMobile&&
        <section className="col-span-4 w-full flex justify-start items-center">
          <Page/>
        </section>}
    </main>}
    </>
  )
}