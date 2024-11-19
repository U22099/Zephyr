import { Loader } from "lucide-react";
import { Label } from "@/components/ui/label";
export function Loading(){
  return (
    <main className="flex gap-1 justify-center items-center h-full w-full">
      <Loader id="loader" className="animate-spin-fast"/>
      <Label htmlFor="loader">Loading...</Label>
    </main>
  )
}