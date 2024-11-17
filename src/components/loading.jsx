import { Loader } from "lucide-react";
export function Loading(){
  return (
    <main className="flex gap-1 justify-center items-center">
      <Loader id="loader" className="animate-spin-fast"/>
      <Label htmlFor="loader">Loading...</Label>
    </main>
  )
}