import { Header } from "./chat-components/header";
import { Input } from "@/components/ui/input";
import { Chats } from "./chat-components/chats";

export function Chats() {
  return (
    <main className="flex flex-col w-full gap-3 p-2">
      <Header />
      <h1 className="font-extrabold text-2xl">Chats</h1>
      <Input placeholder="Search..." />
      <Chats />
    </main>
  )
}