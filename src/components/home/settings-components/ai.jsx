"use client";
import { useUserData, useUID } from "@/store";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { AiOutlineLoading } from "react-icons/ai";
import { Info } from 'lucide-react';
import { updateUserData } from "@/utils";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export function AI() {
  const { toast } = useToast();
  const { userData, setUserData } = useUserData();
  const uid = useUID(state => state.uid);
  const [loading, setLoading] = useState();
  const [info, setInfo] = useState(null);
  const [behavior, setBehavior] = useState(null);
  const [modelType, setModelType] = useState("accurate");
  const [temperature, setTemperature] = useState(userData.temperature);

  const update = async () => {
    setLoading(true);
    await updateUserData(uid, {
      info,
      behavior,
      modelType,
      temperature,
    });
    toast({
      title: "Success",
      description: "updated successfully"
    });
    setUserData({
      ...userData,
      info,
      behavior,
      modelType,
      temperature,
    })
    setLoading(false);
  }
  return (
    <Card className="backdrop-blur-sm flex flex-col w-full">
      <CardContent className="flex flex-col gap-2 p-2 w-full">
        <section>
          <Label htmlFor="info">Personal Info</Label>
          <Textarea placeholder="Tell Zephyr AI about yourself" id="info" defaultValue={userData?.info} onChange={(e) => setInfo(e.target.value)}/>
        </section>
        <section>
          <Label htmlFor="behavior">Behavior</Label>
          <Textarea placeholder="Tell Zephyr AI how to behave" id="behavior" defaultValue={userData?.behavior} onChange={(e) => setBehavior(e.target.value)}/>
        </section>
        <section>
          <Label htmlFor="model">Model Type</Label>
          <RadioGroup defaultValue={userData?.modelType || "accurate"} onValueChange={(value) => setModelType(value)} className="flex flex-col pl-2" id="model">
            <div className="flex gap-2 items-center">
              <RadioGroupItem value="fast" id="fast"/>
              <Label htmlFor="fast">Fast</Label>
            </div>
            <div className="flex gap-2 items-center">
              <RadioGroupItem value="accurate" id="accurate"/>
              <Label htmlFor="accurate">Accurate</Label>
            </div>
          </RadioGroup>
        </section>
        <section className="flex gap-2">
          <Label htmlFor="creativity">Creativity</Label>
          <Slider defaultValue={[temperature || 20]} max={100} step={1} onValueChange={(value) => setTemperature(value[0])}/>
          <p className="text-sm">{temperature || 20}%</p>
        </section>
        <section className="flex gap-1 ml-2 backdrop-blur-md rounded p-2">
          <Separator className="text-muted-foreground-foregroundh-12" orientation="vertical"/>
          <Info className="w-8 text-muted-foreground"/>
          <blockquote className="text-xs text-muted-foreground">
            <p>For creativity slider, use higher values for more creative responses, and lower values for more deterministic responses</p>
            <footer className="italic">
              <a href="https://ai.google.dev/gemini-api/docs/text-generation?lang=node#configure" className="underline text-primary" target="_blank">Gemini AI Docs</a>
            </footer>
          </blockquote>
        </section>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={async () => await update()}>{loading ? <AiOutlineLoading className="animate-spin text-md"/> : "Save"}</Button>
      </CardFooter>
    </Card>
  )
}