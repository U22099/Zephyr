import * as React from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export function SignUp(){
  return (
    <Card className="md:w-[50vw] w-[90vw]">
      <CardHeader>
        <CardTitle className="text-2xl">Zephyr</CardTitle>
        <CardDescription>Create a new zephyr&apos;s account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col gap-4">
              <Button className="w-full" variant="outline"><FcGoogle />Google</Button>
              <Button className="w-full" variant="outline"><FaGithub />Github</Button>
            </div>
          </div>
          <div className="flex gap-2 mx-auto items-center w-[90%] my-2 justify-center self-center">
          <Separator className="w-[40%]"/> 
          <p className="text-muted">or</p> 
          <Separator className="w-[40%]"/> 
          </div>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">UserName</Label>
              <Input id="name" placeholder="Input you username" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Email</Label>
              <Input id="name" placeholder="Input you email" type="email" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Password</Label>
              <Input id="name" placeholder="Input you password" type="password"/>
            </div>
            <Button className="w-full">Sign Up</Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center w-full text-muted">
        Have a zephyr&apos;s account?&nbsp;
        <Link href="/" className="text-violet-800">sign in</Link>
      </CardFooter>
    </Card>
  )

}