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
import { logOut, deleteAccount } from "@/utils";
import { useUID } from "@/store";

export function DangerZone() {
  const router = useRouter();
  const uid = useUID(state => state.uid);
  const [ deleteloading, setDeleteloading ] = useState(false);
  const [ logoutloading, setLogoutloading ] = useState(false);
  return (
    <Card className="backdrop-blur-sm flex justify-center items-center w-full active:bg-muted-foreground">
      <CardContent className="flex items-center gap-2 p-2 w-full">
        <Button disabled={loading} variant="destructive" onClick={async () => {
          setLogoutloading(true);
          await logOut();
          setLogoutloading(false);
          router.push("/");
        }}>{logoutloading ? <AiOutlineLoading className="animate-spin text-md"/> : "Log Out"}</Button>
        <Dialog>
          <DialogTrigger>
            <Button variant="destructive">Delete Account</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Account</DialogTitle>
              <DialogDescription>
                Please note that this would delete your user data permanently from our database, efficiently removing you from all group chat and deleting all personal chat.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button 
              disabled={deleteloading}
              onClick={
              async () => {
                setDeleteloading(true);
                await deleteAccount(uid);
                setDeleteloading(false);
                router.push("/");
              }}
              variant="destructive">{deleteloading ? <AiOutlineLoading className="animate-spin text-md"/> : "Continue"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}