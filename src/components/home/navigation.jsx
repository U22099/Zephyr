import { CircleDotDashed } from 'lucide-react';
import { Users } from 'lucide-react';
import { MessageCircle } from 'lucide-react';
import { Cog } from 'lucide-react';

export function Navigation({nav, setNav}){
  return(
    <main className="fixed bottom-0 flex justify-around py-1 bg-transparent backdrop-blur-md p-2 w-full py-2 border-t">
      <div className="flex flex-col justify-center">
        <CircleDotDashed className={nav === 0 ? "fill-violet-800" : "text-muted"} onClick={() => setNav(0)} id="updates"/>
        <label htmlFor="updates">Updates</label>
      </div>
      <div className="flex flex-col justify-center">
        <Users className={nav === 1 ? "fill-violet-800" : "text-muted"} onClick={() => setNav(1)} id="people"/>
        <label htmlFor="people">People</label>
      </div>
      <div className="flex flex-col justify-center">
        <MessageCircle className={nav === 2 ? "fill-violet-800" : "text-muted"} onClick={() => setNav(2)} id="chats"/>
        <label htmlFor="chats">Chats</label>
      </div>
      <div className="flex flex-col justify-center">
        <Cog className={nav === 3 ? "fill-violet-800" : "text-muted"} onClick={() => setNav(3)} id="settings"/>
        <label htmlFor="settings">Settings</label>
      </div>()
    </main>
  )
}
