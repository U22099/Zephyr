import { usePage } from "@/store";
import { Home } from "./components/home";
import { Profile } from "./components/profile";
import { ChatProfile } from "./components/chat-profile";
import { Chat } from "./components/chat";

export function Page(){
  const { page, setPage } = usePage();
  if(!page.open) return;
  switch (page.component) {
    case 'default':
      return <Home />
    case 'profile':
      return <Profile />
    case 'chat-profile':
      return <ChatProfile />
    case 'chat':
      return <Chat />
    default:
      return <Home />
  }
}