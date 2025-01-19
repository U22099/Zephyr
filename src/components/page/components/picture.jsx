import { motion } from "framer-motion";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { IoClose } from "react-icons/io5";
import { usePage } from "@/store";

export function Picture() {
  const { page, setPage } = usePage();
  return (
    <motion.main initial={{y: 300}} animate={{y: 0}} exit={{y: 300}} transition={{duration: 0.6}} className="flex flex-col w-full p-2 items-center justify-center gap-2 h-full overflow-y-scroll scrollbar">
      <header className="flex justify-start w-full p-2">
        <div className="p-2 rounded-full bg-muted flex justify-center items-center w-12 h-12 cursor-pointer" onClick={() => setPage({
            ...page,
            component: page.data.previousPage
            })}>
          <IoClose className="text-xl fill-black dark:fill-white"/>
        </div>
      </header>
      <Card className="md:w-1/2">
        <CardContent className="p-3 pt-3">
          <img src={page.data.imageDataToView} className="w-full rounded object-fit" />
        </CardContent>
      </Card>
    </motion.main>
  )
}