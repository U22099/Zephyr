"use client";
import { useUserData } from "@/store";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

export function Profile(){
  const { userData, setUserData } = useUserData();
  return(
    <Card className="backdrop-blur-sm flex justify-center items-center w-full">
      <CardContent className="flex gap-2 p-2 w-full">
        <Avatar className="w-16 w-16">
          <AvatarImage src={userData?.imageURL} className="object-cover rounded-full" />
          <AvatarFallback className="text-2xl text-violet-800">{userData.username ? userData.username[0] : "Z"}</AvatarFallback>
        </Avatar>
        <section>
          <h3 className="text-lg font-semibold">{userData?.username}</h3>
          <p className="text-muted truncate">{userData?.bio}</p>
        </section>
      </CardContent>
    </Card>
  )
}