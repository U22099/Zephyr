import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { AiOutlineLoading } from "react-icons/ai";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ForgotPSW({ setEmail, sendCode, loading, error }) {
  return (
    <Card className = "md:w-[50vw] w-[90vw]" >
      <CardHeader>
        <CardTitle className="text-2xl">Zephyr</CardTitle>
        <CardDescription>Reset your password.</CardDescription>
      </CardHeader> 
      <CardContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">Email</Label>
                    <Input id="name" placeholder="Input your email" type="email" onChange={(e) => setEmail(e.target.value)}/>
                  </div>
                  {error&&<p className="font-bold text-red-700 text-sm text-mono">{error}</p>}
                  <Button onClick={async () => await sendCode()} className="w-full">{loading ? <AiOutlineLoading className="animate-spin text-md"/> : "Submit"}</Button>
                </div> 
          </form>
        </CardContent>
        <CardFooter>
          <Link href="/" className="mt-5 mx-auto text-sm text-violet-800">Log In</Link>
        </CardFooter>
    </Card>
  )
}