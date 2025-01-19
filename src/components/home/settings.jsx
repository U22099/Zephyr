import { usePage } from "@/store";
import { Profile } from "./settings-components/profile";
import { DangerZone } from "./settings-components/danger-zone";
import { AI } from "./settings-components/ai";
export function Settings() {
  const setPage = usePage(state => state.setPage);
  return (
    <main className="flex flex-col w-full gap-3 p-4 pb-12 select-none h-screen  overflow-y-scroll scrollbar min-h-screen">
      <h1 className="font-extrabold text-2xl">Settings</h1>
      <section onClick={() => setPage({
        open: true,
        component: "profile"
      })}>
        <Profile />
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="font-semibold text-xl">AI Customization</h2>
        <AI />
      </section>
      <section className="flex flex-col gap-3 mb-14">
        <h2 className="font-semibold text-xl text-red-700">Danger Zone</h2>
        <DangerZone />
      </section>
    </main>
  )
}