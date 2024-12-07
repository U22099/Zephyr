import { motion } from "framer-motion";
export function Home(){
  return(
    <motion.main initial={{x: 300}} animate={{x: 0}} exit={{x: 300}} transition={{duration: 0.3}} className="flex justify-center items-center h-full w-full">
      <img src="/z-gif.gif" alt="Zephyr" className="w-60 h-60 object-cover"/>
    </motion.main>
  )
}