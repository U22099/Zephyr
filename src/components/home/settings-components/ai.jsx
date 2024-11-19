"use client";
import { useUserData } from "@/store";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function AI() {
  const { userData, setUserData } = useUserData();
  return (
    <Card className="backdrop-blur-sm flex justify-center items-center w-full">
      <CardContent className="flex flex-col gap-2 p-2">
        <section>
          <Label htmlFor="info">Personal Info</Label>
          <Textarea placeholder="Tell zephyr AI about yourself" id="info" />
        </section>
        <section>
          <Label htmlFor="info">Behavior</Label>
          <Textarea placeholder="Tell zephyr AI how to behave" id="info" />
        </section>
      </CardContent>
    </Card>
  )
}