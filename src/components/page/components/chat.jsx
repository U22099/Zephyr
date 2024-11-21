import { motion } from "framer-motion";
import { usePage } from "@/store";
export function Chat() {
  const setPage = usePage(state => state.setPage);
  return (
    <motion.main initial={{x: 300}} animate={{x: 0}} exit={{x: 300}} transition={{duration: 0.3}} onClick={() => setPage({open: false, component: "default"})}>
      Chat
    </motion.main>
  )
}