import { motion } from "framer-motion";
export function Home(){
  return(
    <motion.main initial={{x: 300}} animate={{x: 0}} exit={{x: 300}} transition={{duration: 0.3}}>
      Home
    </motion.main>
  )
}