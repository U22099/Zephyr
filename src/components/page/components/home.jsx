import { motion } from "framer-motion";
export function Home(){
  return(
    <motion.main initial={{x: 300}} animate={{x: 0}}>
      Home
    </motion.main>
  )
}