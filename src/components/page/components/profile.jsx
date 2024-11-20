import { motion } from "framer-motion";
export function Profile() {
  return (
    <motion.main initial={{x: 300}} animate={{x: 0}}>
      Profile
    </motion.main>
  )
}