import { usePage } from "@/store";
import { Home } from "./components/home";
import { Profile } from "./components/profile";
import { ChatProfile } from "./components/chat-profile";
import { AddStatus } from "./components/add-status";
import { ViewStatus } from "./components/view-status";
import { IncomingVoiceCall } from "./components/incoming-voice-call";
import { IncomingVideoCall } from "./components/incoming-video-call";
import { VoiceCall } from "./components/voice-call";
import { VideoCall } from "./components/video-call";
import { Chat } from "./components/chat";

export function Page() {
  const { page, setPage } = usePage();
  if (!page.open) return;
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
    case 'incoming-voice-call':
      return <IncomingVoiceCall />
    case 'incoming-video-call':
      return <IncomingVideoCall />
    case 'voice-call':
      return <VoiceCall />
    case 'video-call':
      return <VideoCall />
    case 'chat':
      return <Chat />
    default:
      return <Home />
  }
}