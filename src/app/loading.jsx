import { Loader } from "lucide-react";
import { Label } from "@/components/ui/label";
export default function Home() {
  return (
    <main className="flex gap-1 justify-center items-center">
      <Loader id="loader" className="animate-spin-fast"/>
      <Label htmlFor="loader">Loading...</Label>
    </main>
  )
}