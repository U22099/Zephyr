import { RiCheckDoubleLine } from "react-icons/ri";
import { FaCamera } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export function Header() {
  return (
    <main className="sticky top-0 left-0 w-full grid grid-cols-10 grid-gap-2 backdrop-blur-sm relative pt-2 pb-4 border-b z-10">
      <div className="col-span-1 p-1 rounded-full bg-primary flex justify-center items-center w-6 h-6">
        <RiCheckDoubleLine className="text-xl fill-white"/>
      </div>
      <h3 className="col-span-6 w-full flex justify-center items-center text-center">Chats</h3>
      <div className="col-span-1 p-1 rounded-full bg-gray-700 flex justify-center items-center w-6 h-6">
        <p className="text-primary">AI</p>
      </div>
      <div className="col-span-1 p-1 rounded-full bg-gray-700 flex justify-center items-center w-6 h-6">
        <FaCamera className="text-xl fill-white"/>
      </div>
      <div className="col-span-1 p-1 rounded-full bg-primary flex justify-center items-center w-6 h-6">
        <Drawer>
          <DrawerTrigger><FaPlus className="text-xl fill-white"/></DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Are you absolutely sure?
              </DrawerTitle>
              <DrawerDescription>This action cannot be undone.
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <p>Submit</p>
              <DrawerClose>
                <p>Cancel</p>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </main>
  )
}