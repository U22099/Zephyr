import { usePage } from "@/store";
import { Home } from "./components/home";
import { Profile } from "./components/profile";
import { ChatProfile } from "./components/chat-profile";
import { AddStatus } from "./components/add-status";
import { ViewStatus } from "./components/view-status";
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
    case 'add-status':
      return <AddStatus />
    case 'view-status':
      return <ViewStatus />
    case 'chat':
      return <Chat />
    default:
      return <Home />
  }
}