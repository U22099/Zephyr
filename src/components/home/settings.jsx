import { Profile } from "./settings-components/profile";
import { AI } from "./settings-components/ai";
export function Settings() {
  return (
    <main className="flex flex-col justify-start items-start gap-2">
      <h1>Settings</h1>
      <section>
        <h2>Profile</h2>
        <Profile />
      </section>
      <section>
        <h2>AI Customization</h2>
        <AI />
      </section>
    </main>
  )
}