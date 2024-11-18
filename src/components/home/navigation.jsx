import { MessageCircleDashed } from 'lucide-react';
import { Users } from 'lucide-react';
import { MessageCircle } from 'lucide-react';
import { Cog } from 'lucide-react';

export function Navigation({nav, setNav}){
  return(
    <main className="fixed bottom-0 flex gap-around py-1 bg-transparent backdrop-blur-md">
      <MessageCircleDashed className={nav === 0 && "fill-violet-800"} onClick={() => setNav(0)}/>
      <Users className={nav === 1 && "fill-violet-800"} onClick={() => setNav(1)}/>
      <MessageCircle className={nav === 2 && "fill-violet-800"} onClick={() => setNav(2)}/>
      <Cog className={nav === 3 && "fill-violet-800"} onClick={() => setNav(3)}/>
    </main>
  )
}
