"use client";
import { deleteAccount, logOut } from "@/utils";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AiOutlineLoading } from "react-icons/ai";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUID, useUserData } from "@/store";
import { deleteSession } from "@/lib/utility/index";

export function DangerZone() {
  const router = useRouter();
  const userData = useUserData(state => state.userData);
  const uid = useUID(state => state.uid);
  const [ deleteloading, setDeleteloading ] = useState(false);
  const [ logoutloading, setLogoutloading ] = useState(false);
  return (
    <Card className="backdrop-blur-sm flex justify-center items-center w-full">
      <CardContent className="flex flex-col items-center gap-2 p-2 w-full">
        <Button className="w-full" disabled={logoutloading} variant="destructive" onClick={async () => {
          setLogoutloading(true);
          localStorage.removeItem("logged");
          await logOut();
          deleteSession();
          setLogoutloading(false);
          router.push("/");
        }}>{logoutloading ? <AiOutlineLoading className="animate-spin text-md"/> : "Log Out"}</Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full" variant="destructive">Delete Account</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Account</DialogTitle>
              <DialogDescription>
                Please note that this would delete your user data permanently from our database, effectively removing you from all group chat and deleting all personal chat.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button 
              disabled={deleteloading}
              onClick={
              async () => {
                setDeleteloading(true);
                await deleteAccount(uid, userData.username);
                deleteSession();
                localStorage.removeItem("logged");
                localStorage.removeItem("visited");
                setDeleteloading(false);
                router.push("/");
              }}
              type="submit"
              variant="destructive">{deleteloading ? <AiOutlineLoading className="animate-spin text-md"/> : "Continue"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}