import { usePage } from "@/store";
import { Profile } from "./settings-components/profile";
import { AI } from "./settings-components/ai";
export function Settings() {
  const setPage = usePage(state => state.setPage);
  return (
    <main className="flex flex-col w-full gap-3 p-4 mt-8">
      <h1 className="font-extrabold text-2xl">Settings</h1>
      <section onClick={() => setPage({
        open: true,
        component: "profile"
      })}>
        <Profile />
      </section>
      <section className="flex flex-col gap-3 mb-14">
        <h2 className="font-semibold text-xl">AI Customization</h2>
        <AI />
      </section>
    </main>
  )
}