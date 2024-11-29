import { RiCheckDoubleLine } from "react-icons/ri";
import { FaCamera } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Users } from "@/components/home/people-components/users";

export function Header() {
  return (
    <main className="sticky top-0 left-0 w-full grid grid-cols-10 grid-gap-2 backdrop-blur-sm relative pt-2 pb-4 border-b z-10">
      <div className="col-span-1 p-1 rounded-full bg-primary flex justify-center items-center w-8 h-8">
        <RiCheckDoubleLine className="text-xl fill-white"/>
      </div>
      <h3 className="col-span-6 w-full flex justify-center items-center text-center font-bold text-lg">Chats</h3>
      <div className="col-span-1 p-1 rounded-full bg-muted flex justify-center items-center w-8 h-8">
        <Drawer>
          <DrawerTrigger><p className="text-primary">AI</p></DrawerTrigger>
          <DrawerContent className="flex flex-col p-2">
            <DrawerHeader>
              <DrawerTitle className="text-primary">Zephyr AI
              </DrawerTitle>
            </DrawerHeader>
          </DrawerContent>
        </Drawer>
      </div>
      <div className="col-span-1 p-1 rounded-full bg-muted flex justify-center items-center w-8 h-8">
        <FaCamera className="text-xl fill-white"/>
      </div>
      <div className="col-span-1 p-1 rounded-full bg-primary flex justify-center items-center w-8 h-8">
        <Drawer>
          <DrawerTrigger><FaPlus className="text-xl fill-white"/></DrawerTrigger>
          <DrawerContent className="flex flex-col p-2">
            <DrawerHeader>
              <DrawerTitle>New Chats
              </DrawerTitle>
            </DrawerHeader>
            <Users />
          </DrawerContent>
        </Drawer>
      </div>
    </main>
  )
}