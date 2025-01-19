import { Users } from "./people-components/users";

export function People() {
  return (
    <main className="flex flex-col w-full gap-3 p-2 pb-12 select-none h-screen  min-h-screen overflow-y-scroll scrollbar ">
      <h1 className="font-extrabold text-2xl">People</h1>
      <Users/>
    </main>
  )
}