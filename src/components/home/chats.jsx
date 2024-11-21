import { Header } from "./chat-components/header";
import { Input } from "@/components/ui/input";
import { Messages } from "./chat-components/messages";

export function Chats() {
  const sample = [{
    image: "https://res.cloudinary.com/dza4icrpd/image/upload/v1732150487/images/moyfwtjgehmxyolitsgo.jpg",
    username: "John",
    lastMessage: "hello there, daniel",
    time: "7:12pm"
  }]
  return (
    <main className="flex flex-col w-screen gap-3 p-2">
      <Header />
      <h1 className="font-extrabold text-2xl">Chats</h1>
      <Input placeholder="Search..."/>
      {sample.map((x, i) => <Messages key={i} username={x.username} lastMessage={lastMessage} time={time}/>)}
    </main>
  )
}