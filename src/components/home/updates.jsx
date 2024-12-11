import { Posts } from "./update-components/posts";
export function Updates() {
  return (
    <main className="flex flex-col w-screen gap-3 p-2 mb-12">
      <h1 className="font-extrabold text-2xl">Updates</h1>
      <Posts/>
    </main>
  )
}