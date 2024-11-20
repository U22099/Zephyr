import { motion } from "framer-motion";
export function Chat() {
  return (
    <motion.main initial={{x: 300}} animate={{x: 0}}>
      Chat
    </motion.main>
  )
}