"use client";
import { useUserData } from "@/store";
export function Profile(){
  const { userData, setUserData } = useUserData();
  return(
    <main>
    Profile
    </main>
  )
}