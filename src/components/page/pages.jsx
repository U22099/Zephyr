import { usePage } from "@/store";
import { Home } from "./components/home";
import { Profile } from "./components/profile";
import { ChatProfile } from "./components/chat-profile";
import { AddStatus } from "./components/add-status";
import { ViewStatus } from "./components/view-status";
import { VoiceCall } from "./components/voice-call";
import { VideoCall } from "./components/video-call";
import { Chat } from "./components/chat";
import { Picture } from "./components/picture";
import { useIsMobile } from "@/hooks/use-mobile";

export function Page() {
  const { page, setPage } = usePage();
  const isMobile = useIsMobile();
  if (!page.open&&isMobile) return;
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
    case 'voice-call':
      return <VoiceCall />
    case 'video-call':
      return <VideoCall />
    case 'chat':
      return <Chat />
    case 'picture':
      return <Picture />
    default:
      return <Home />
  }
}