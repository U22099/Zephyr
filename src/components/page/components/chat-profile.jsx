import { motion } from "framer-motion";
import { FaChevronLeft } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
} from "@/components/ui/drawer";
import { AiOutlineLoading } from "react-icons/ai";
import { Separator } from "@/components/ui/separator";
import { usePage, useUID, useUserData } from "@/store";
import { useState, useEffect } from "react";
import { deleteConversation, leaveGroup, getPeople, updateGroupMembers } from "@/utils";

export function ChatProfile() {
  const { page, setPage } = usePage();
  const userData = useUserData(state => state.userData);
  const uid = useUID(state => state.uid);
  const [loading, setLoading] = useState(false);
  const [people, setPeople] = useState([]);
  const [peopleFilter, setPeopleFilter] = useState([]);
  const [group, setGroup] = useState({
    members: page.data.type === "group" ? [...page.data.members] : [],
    participants: [],
  });
  const [addmemberloading, setAddmemberloading] = useState(false);
  useEffect(() => {
    if ((page.data.type === "group") && (page.data.admin === uid)) {
      getPeople(uid, setPeople);
    }
  }, []);
  useEffect(() => {
    if(people.length){
      setPeopleFilter([...people]);
    }
  }, [people]);
  return (
    <motion.main initial={{x: 300}} animate={{x: 0}} exit={{x: 300}} transition={{duration: 0.3}} className="flex h-screen flex-col items-center justify-start w-full gap-1 p-2">
      <header className="sticky top-0 left-0 w-full flex justify-start text-center items-center backdrop-blur-sm pb-2 border-b z-10">
        <FaChevronLeft 
        onClick={() => setPage({open: true, component: 'chat', data: {...page.data}})}
        className="self-start dark:fill-white fill-black w-6 h-6"/>
      </header>
      <section className="flex w-full justify-center flex-col items-center mt-10">
        <Avatar className="w-28 h-28">
          <AvatarImage src={page.data.image} className="object-cover rounded-full" />
          <AvatarFallback className="text-2xl text-primary">{page.data.name ? page.data.name[0] : "Z"}
          </AvatarFallback>
        </Avatar>
        <h2 className="text-2xl font-bold">{page.data.name}</h2>
      </section>
      <section className="flex flex-col items-center justify-center gap-1 break-words mb-10">
        <h4 className="text-lg text-muted-foreground font-semibold">{page.data.bio || page.data.description}</h4>
        <p className="text-md text-muted-foreground font-semibold">{page.data.active || page.data.members.join(",")}</p>
      </section>
      {(page.data.type === "group"&&page.data.admin === uid)&&
        <Drawer>
          <DrawerTrigger asChild>
            <Button className="w-full mb-1">{addmemberloading ? <AiOutlineLoading className="animate-spin text-md"/> : "Add/Remove Members"}</Button>
          </DrawerTrigger>
          <DrawerContent className="max-h-[90vh]">
            <DrawerHeader>
              <DrawerTitle>Add/Remove Members</DrawerTitle>
            </DrawerHeader>
            <section className="flex flex-col gap-2 h-full overflow-y-scroll scrollbar">
              <Input placeholder="Search..." onChange={(e) => {
                if(!e.target.value){
                  setPeopleFilter([...people]);
                }
                setPeopleFilter(people.filter(x => x.name?.toLowerCase()?.includes(e.target.value.toLowerCase())));
              }}/>
              <section className="flex flex-col gap-2">
                <h3 className="text-lg">Members</h3>
                {peopleFilter&&peopleFilter.sort((a, b) => a.name?.localeCompare(b.name)).filter(x => group?.members?.includes(x.name)).map((doc,i) => <CardList key={i} doc={doc} action={() => setGroup({
                  members: group?.members.filter(x => x != doc.name),
                  participants: group?.participants.filter(x => x != doc.uid)
                })}/>)}
              </section>
              <Separator />
              <section className="flex flex-col gap-2">
                <h3 className="text-lg">Add Members</h3>
                {peopleFilter&&peopleFilter.sort((a, b) => a.name?.localeCompare(b.name)).filter(x => !group?.members?.includes(x.name)).map((doc,i) => <CardList key={i} doc={doc}  action={() => setGroup({
                  members: [...group?.members, doc.name],
                  participants: [...group?.participants, doc.uid]
                })}/>)}
              </section>
            </section>
            <DrawerFooter>
              <Button className="w-full"
              disabled={addmemberloading}
              type="submit"
              onClick={
                async () => {
                  setAddmemberloading(true);
                  await updateGroupMembers(page.data.uid, group);
                  setAddmemberloading(false);
                  setPage({
                    open: true,
                    component: "chat",
                    data: {
                      ...page.data,
                      members: [...group.members],
                    }
                  });
              }}
            >{addmemberloading ? <AiOutlineLoading className="animate-spin text-md"/> :  "Update Group"}</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>}
      <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive" className="w-full">{loading ? <AiOutlineLoading className="animate-spin text-md"/> : page.data.type === "group" ? (page.data.admin === uid ? "Delete Group" : "Leave Group") : "Delete Conversation"}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure about this?</DialogTitle>
              <DialogDescription>
                Hit the button below to confirm
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button 
              disabled={loading}
              onClick={
              async () => {
                setLoading(true);
                if((page.data.type === "group"&&page.data.admin === uid) || page.data.type === "personal"){
                  await deleteConversation(uid, page.data.uid);
                } else {
                  await leaveGroup(uid, page.data.uid, userData.username);
                }
                setLoading(false);
                setPage({
                  open: false,
                  component: "default"
                })
              }}
              type="submit"
              variant="destructive">{loading ? <AiOutlineLoading className="animate-spin text-md"/> : "Continue"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </motion.main>
  )
}

function CardList({ doc, action }) {
  return (
    <Card className="flex w-full justify-start items-center h-fit" onClick={action}>
      <CardContent className="flex p-1 items-center gap-2">
        <Avatar className="w-12 h-12">
          <AvatarImage className="w-12 h-12 object-cover rounded-full" src={doc?.image} alt="profile-image"/>
          <AvatarFallback className="text-3xl text-primary">{
          doc?.name ? doc.name[0] : "Z"
          }</AvatarFallback>
        </Avatar>
        <section className="flex flex-col justify-center gap-1">
          <h2 className="text-lg font-bold">{doc?.name || "No Name"}</h2>
          <p className="truncate text-sm text-muted-foreground">{doc?.bio || ""}</p>
        </section>
      </CardContent> 
    </Card>
  )
}