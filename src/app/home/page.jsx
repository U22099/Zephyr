import { Navigation } from "@/components/home/navigation";
import { Updates } from "@/components/home/updates";
import { People } from "@/components/home/people";
import { Chats } from "@/components/home/chats";
import { Settings } from "@/components/home/setting";
import { useEffect, useState } from "react";

export default function Home(){
  const [nav, setNav] = useState(2);
  return(
    <main>
      { nav === 0 ? <Updates /> 
      : nav === 1 ? <People />
      : nav === 2 ? <Chats />
      : nav === 3 ? <Settings /> 
      : <Chats />}
      <Navigation setNav={setNav} nav={nav}/>
    </main>
  )
}