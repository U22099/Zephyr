import { motion } from "framer-motion";
export function Home(){
  return(
    <motion.main initial={{x: 300}} animate={{x: 0}} transition={{duration: 1}}>
      Home
    </motion.main>
  )
}