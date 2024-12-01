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
    <Card className="backdrop-blur-sm flex justify-center items-center w-full active:bg-muted-foreground">
      <CardContent className="flex items-center gap-2 p-2 w-full">
        <Avatar className="w-20 h-20">
          <AvatarImage src={userData?.imageURL} className="object-cover rounded-full" />
          <AvatarFallback className="text-2xl text-primary">{userData.username ? userData.username[0] : "Z"}</AvatarFallback>
        </Avatar>
        <section>
          <h3 className="text-lg font-semibold">{userData?.username}</h3>
          <p className="text-muted-foreground-foreground truncate w-32">{userData?.bio}</p>
        </section>
      </CardContent>
    </Card>
  )
}