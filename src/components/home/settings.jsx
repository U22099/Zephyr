import { Profile } from "./settings-components/profile";
import { AI } from "./settings-components/ai";
export function Settings() {
  return (
    <main className="flex flex-col w-full gap-3 p-4 mt-8 mb-14">
      <h1 className="font-extrabold text-2xl">Settings</h1>
      <section>
        <Profile />
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="font-semibold text-xl">AI Customization</h2>
        <AI />
      </section>
    </main>
  )
}