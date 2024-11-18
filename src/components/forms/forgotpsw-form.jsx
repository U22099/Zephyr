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

export function ForgotPSW({ setEmail, passwordReset, loading, error, toast }) {
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <Card className = "md:w-[50vw] w-[90vw]" >
        <CardHeader>
          <CardTitle className="text-2xl">Zephyr</CardTitle>
          <CardDescription>Reset your password.</CardDescription>
        </CardHeader> 
        <CardContent>
          <div className="grid w-full items-center gap-4">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="name">Email</Label>
                  <Input id="name" placeholder="Input your email" type="email" onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                  {error&&<p className="font-bold text-red-700 text-sm text-mono">{error}</p>}
                  <Button onClick={async () => {
                    await passwordReset()
                    toast({
                      description: "Email sent successfully, check your email to reset password.",
                    });
                  }} className="w-full">{loading ? <AiOutlineLoading className="animate-spin text-md"/> : "Submit"}</Button>
                </div> 
          </CardContent>
          <CardFooter>
            <Link href="/" className="mt-5 mx-auto text-sm text-violet-800">Sign In</Link>
          </CardFooter>
      </Card>
    </form>
  )
}