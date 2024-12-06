import { Loader } from "lucide-react";
import { Label } from "@/components/ui/label";
export function Loading({ className }) {
  return (
    <main className={`flex gap-1 justify-center items-center h-screen w-screen ${className || ""}`}>
      <Loader id="loader" className="animate-spin-fast"/>
      <Label htmlFor="loader">Loading...</Label>
    </main>
  )
}