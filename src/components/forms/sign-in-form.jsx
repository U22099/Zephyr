import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineLoading } from "react-icons/ai";

export function SignIn({ setEmail, setPassword, signIn, loading, error, resend }) {
  return (
    <Card className="md:w-[50vw] w-[90vw]">
      <CardHeader>
        <CardTitle className="text-2xl">Zephyr</CardTitle>
        <CardDescription>Sign into your zephyr&apos;s account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col gap-4">
              <Button type="button" className="w-full" variant="outline" onClick={
              async () => {
                await signIn("google");
                }
              } ><FcGoogle />Google</Button>
              <Button type="button" className="w-full" variant="outline" onClick={async () => {
                    await signIn("github");
                  }} ><FaGithub />Github</Button>
            </div>
          </div>
          <div className="flex gap-2 mx-auto items-center w-[90%] my-2 justify-center self-center">
          <Separator className="w-[40%]"/> 
          <p className="text-muted-foreground">or</p> 
          <Separator className="w-[40%]"/> 
          </div>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Email</Label>
              <Input id="name" placeholder="Input your email" type="email" onChange={(e) => setEmail(e.target.value.trim())} required/>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Password</Label>
              <Input id="name" placeholder="Input your password" type="password" onChange={(e) => setPassword(e.target.value.trim())} required />
            </div>
            {error&&<p className="font-bold text-red-700 text-sm text-mono">{error}</p>}
            <Button disabled={loading || error} type="submit" onClick={async () => {
                await signIn("credentials");
              }} className="w-full">{loading ? <AiOutlineLoading className="animate-spin text-md"/> : !resend ? "Sign In" : "Resend Verification Link"}</Button>
            <Link href="/forgotpsw" className="mt-5 mx-auto text-sm text-primary">Forgot password?</Link>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col justify-center w-full text-muted-foreground-foregroundflex-col text-wrap text-center">
        New to zephyr?&nbsp;
        <p className="text-primary text-sm">Don&apos;t worry zephyr automatically creates a new account for you</p>
      </CardFooter>
    </Card>
  )

}