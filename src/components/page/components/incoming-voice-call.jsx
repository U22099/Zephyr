import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { usePage, useSocket } from "@/store";

export function IncomingVoiceCall() {
  const socket = useSocket(state => state.socket);
  const userData = useUserData(state => state.userData);
  const { page, setPage } = usePage();
  const accept = () => {
    socket.emit("voice-call-accepted", {
      to: page.data.from,
      from: page.data.to,
      userData: {
        image: userData.image,
        name: userData.username
      },
      roomID: page.data.roomID
    });
    setPage({
      open: true,
      component: "voice-call",
      data: {
        incoming: true,
        callFrom: page.data.from,
        callTo: page.data.to,
        roomID: page.data.roomID,
        callerData: page.data.userData,
        recieverData: {
          image: userData.image,
          name: userData.username
        }
      }
    });
  }
  const reject = () => {
    socket.emit("voice-call-rejected", {to: page.data.from});
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Voice Call
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 justify-start items-center p-2 py-3 h-full w-full">
        <Avatar className="w-32 h-32">
          <AvatarImage className="w-32 h-32 object-cover rounded-full" src={page.data.userData.image} alt="profile-image"/>
          <AvatarFallback className="text-3xl text-primary">{page.data.userData.name ? page.data.userData.name[0] : "Z"}</AvatarFallback>
        </Avatar>
        <h3 className="max-w-40 truncate">{page.data.userData.name}</h3>
        <section className="flex gap-2 justify-center items-center">
          <Button onClick={reject} variant="outline">Decline</Button>
          <Button onClick={accept} className="animate-pulse">Accept</Button>
        </section>
      </CardContent>
    </Card>
  )
}