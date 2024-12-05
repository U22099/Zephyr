import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { usePage, useSocket } from "@/store";

export function IncomingVideoCall() {
  const socket = useSocket(state => state.socket);
  const userData = useUserData(state => state.userData);
  const { page, setPage } = usePage();
  const accept = () => {
    socket.emit("video-call-accepted", {
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
      component: "video-call",
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
    socket.emit("video-call-rejected", { to: page.data.from });
  }
  return (
    <Sheet defaultOpen={true}>
      <SheetHeader>
        <SheetTitle>
          Video Call
        </SheetTitle>
      </SheetHeader>
      <SheetContent className="flex gap-2 justify-start items-center p-2 py-3">
        <Avatar className="w-20 h-20">
          <AvatarImage className="w-20 h-20 object-cover rounded-full" src={page.data.userData.image} alt="profile-image"/>
          <AvatarFallback className="text-3xl text-primary">{page.data.userData.name ? page.data.userData.name[0] : "Z"}</AvatarFallback>
        </Avatar>
        <h3 className="max-w-40 truncate">{page.data.userData.name}</h3>
        <SheetClose className="flex gap-2 justify-center items-center">
          <Button onClick={reject} variant="outline">Decline</Button>
          <Button onClick={accept} className="animate-pulse">Accept</Button>
        </SheetClose>
      </SheetContent>
    </Sheet>
  )
}