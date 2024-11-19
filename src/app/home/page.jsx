"use client";
import { Navigation } from "@/components/home/navigation";
import { Updates } from "@/components/home/updates";
import { People } from "@/components/home/people";
import { Chats } from "@/components/home/chats";
import { Settings } from "@/components/home/settings";
import { Loading } from "@/components/loading";
import { useUserData } from "@/store";
import { getUserData } from "@/utils";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";

export default function Home(){
  const [ user ] = useAuthState(auth);
  const [nav, setNav] = useState(2);
  const [loading, setLoading] = useState(false);
  const setUserData = useUserData(state => state.setUserData);
  useEffect(() => {
    if(user){
      setLoading(true);
      getUserData(user.uid, setUserData);
      setLoading(false);
    }
  }, [user]);
  return(
    <>
    { loading ? <Loading /> : <main className="flex min-h-screen flex-col items-start justify-start w-full">
      { nav === 0 ? <Updates /> 
      : nav === 1 ? <People />
      : nav === 2 ? <Chats />
      : nav === 3 ? <Settings /> 
      : <Chats />}
      <Navigation setNav={setNav} nav={nav}/>
    </main>}
    </>
  )
}