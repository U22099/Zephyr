import { RiCheckDoubleLine } from "react-icons/ri";
import { FaCamera } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
export function Header(){
  return(
    <main className="sticky top-0 left-0 w-full grid grid-cols-10 grid-gap-2 backdrop-blur-sm relative pt-2 pb-4 border-b z-10">
      <div className="col-span-1 p-2 rounded-full bg-primary">
        <RiCheckDoubleLine />
      </div>
      <h3 className="col-span-6 w-full flex justify-center items-center text-center">Chats</h3>
      <div className="col-span-1 p-2 rounded-full bg-gray-900">
      </div>
      <div className="col-span-1 p-2 rounded-full bg-gray-900">
        <FaCamera />
      </div>
      <div className="col-span-1 p-2 rounded-full bg-primary">
        <FaPlus />
      </div>
    </main>
  )
}