import { CircleFadingPlus } from 'lucide-react';
import { Users } from 'lucide-react';
import { MessageCircle } from 'lucide-react';
import { Cog } from 'lucide-react';

export function Navigation({nav, setNav}){
  return(
    <main className="fixed bottom-0 flex justify-around py-1 bg-transparent backdrop-blur-md p-2 w-full py-2 border-t ">
      <CircleFadingPlus className={nav === 0 ? "fill-violet-800" : "text-muted fill-gray-500"} onClick={() => setNav(0)}/>
      <Users className={nav === 1 ? "fill-violet-800" : "text-muted fill-gray-500"} onClick={() => setNav(1)}/>
      <MessageCircle className={nav === 2 ? "fill-violet-800" : "text-muted fill-gray-500"} onClick={() => setNav(2)}/>
      <Cog className={nav === 3 ? "fill-violet-800" : "text-muted fill-gray-500"} onClick={() => setNav(3)}/>
    </main>
  )
}
