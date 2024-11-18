import { CircleDotDashed } from 'lucide-react';
import { Users } from 'lucide-react';
import { MessageCircle } from 'lucide-react';
import { Cog } from 'lucide-react';

export function Navigation({nav, setNav}){
  return(
    <main className="fixed bottom-0 flex justify-around py-1 bg-transparent backdrop-blur-md p-2 w-full py-2 border-t">
      <div className="flex flex-col justify-center items-center text-center text-lg">
        <CircleDotDashed className={nav === 0 ? "fill-violet-800" : "text-muted"} onClick={() => setNav(0)} id="updates"/>
        <label htmlFor="updates" className="text-sm">Updates</label>
      </div>
      <div className="flex flex-col justify-center items-center text-center">
        <Users className={nav === 1 ? "fill-violet-800" : "text-muted"} onClick={() => setNav(1)} id="people"/>
        <label htmlFor="people" className="text-sm">People</label>
      </div>
      <div className="flex flex-col justify-center items-center text-center">
        <MessageCircle className={nav === 2 ? "fill-violet-800" : "text-muted"} onClick={() => setNav(2)} id="chats"/>
        <label htmlFor="chats" className="text-sm">Chats</label>
      </div>
      <div className="flex flex-col justify-center items-center text-center">
        <Cog className={nav === 3 ? "fill-violet-800" : "text-muted"} onClick={() => setNav(3)} id="settings"/>
        <label htmlFor="settings" className="text-sm">Settings</label>()
      </div>
    </main>
  )
}
