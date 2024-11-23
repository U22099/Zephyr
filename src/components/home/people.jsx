import { Users } from "./people-components/users";
import { Input } from "@/components/ui/input";

export function People() {
  return (
    <main className="flex flex-col w-screen gap-3 p-2">
      <h1 className="font-extrabold text-2xl">People</h1>
      <Input placeholder="Search..."/>
      <Users />
    </main>
  )
}