import { Posts } from "./update-components/posts";
export function Updates() {
  return (
    <main className="flex flex-col w-full gap-3 p-2 mb-12 min-h-screen">
      <h1 className="font-extrabold text-2xl">Updates</h1>
      <Posts/>
    </main>
  )
}