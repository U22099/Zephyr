import { Header } from "./chat-components/header";
import { Input } from "@/components/ui/input";
import { Messages } from "./chat-components/messages";

export function Chats() {
  return (
    <main className="flex flex-col w-full gap-3 p-2 min-h-screen border">
      <Header />
      <h1 className="font-extrabold text-2xl w-full flex justify-center items-center text-center">Chats</h1>
      <Input placeholder="Search..."/>
      <Messages />
    </main>
  )
}