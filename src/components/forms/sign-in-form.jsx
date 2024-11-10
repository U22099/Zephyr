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

export function SignIn(){
  return (
    <Card className="md:w-[50vw] w-[90vw]">
      <CardHeader>
        <CardTitle className="text-2xl">Zephyr</CardTitle>
        <CardDescription>Log into your zephyr's account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col gap-4">
              <Button className="w-full" variant="outline">Google</Button>
              <Button className="w-full" variant="outline">Github</Button>
            </div>
          </div>
          <div className="flex gap-2 mx-auto items-center w-[90%] my-2 justify-center self-center">
          <Separator className="w-[40%]"/> 
          <p className="text-muted">or</p> 
          <Separator className="w-[40%]"/> 
          </div>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Email</Label>
              <Input id="name" placeholder="Input you email" />
            </div>
            <Button className="w-full">Log In</Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center w-full text-muted">
        New to zephyr?&nbsp;
        <Link href="/signup" className="text-violet-900">sign up</Link>
      </CardFooter>
    </Card>
  )

}