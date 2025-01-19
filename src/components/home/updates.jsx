import { Posts } from "./update-components/posts";
export function Updates() {
  return (
    <main className="flex flex-col w-full gap-3 p-2 mb-12 min-h-[calc(100vh-2px)]">
      <h1 className="font-extrabold text-2xl">Updates</h1>
      <Posts/>
    </main>
  )
}