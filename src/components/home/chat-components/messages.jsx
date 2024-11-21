import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { usePage } from "@/store";

export function Messages({ key, image, username, lastMessage, time }){
  const setPage = usePage(state => state.setPage);
  return(
    <main key={key} className="flex gap-2 active:bg-gray-800" onClick={() => setPage({
      open: true,
      type: "chat"
    })}>
      <Avatar className="mt-8 w-36 h-36">
        <AvatarImage className="w-36 h-36 object-cover rounded-full" src={image} alt="profile-image"/>
        <AvatarFallback className="text-3xl text-primary">{username ? username[0] : "Z"}</AvatarFallback>
      </Avatar>
      <section className="py-1 h-full flex flex-col justify-center border-b gap-1">
        <header className="flex gap-1">
          <h1 className="text-xl font-bold">{username}</h1>
          <p className="text-sm">{time}</p>
        </header>
        <p className="truncate text-sm">{lastMessage}</p>
      </section>
    </main>
  )
}