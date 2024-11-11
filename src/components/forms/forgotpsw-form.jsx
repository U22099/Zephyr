import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { AiOutlineLoading } from "react-icons/ai";

export function ForgotPSW({ setEmail, sendCode, loading, error }) {
  return (
  <form onSubmit={(e) => e.preventDefault()}>
    <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Email</Label>
              <Input id="name" placeholder="Input your email" type="email" onChange={(e) => setEmail(e.target.value)}/>
            </div>
            {error&&<p className="font-bold text-red-700 text-sm text-mono">{error}</p>}
            <Button onClick={async () => await sendCode()} className="w-full">{loading ? <AiOutlineLoading className="animate-spin text-md"/> : "Sign In"}</Button>
            <Link href="/m" className="mt-20 text-sm text-violet-800">Log In</Link>
          </div> 
    </form>
  )
}